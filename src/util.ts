import * as vscode from 'vscode';
import * as path from 'path';

const channel = vscode.window.createOutputChannel('CTags');

export function log(...args: any[]) {
  // 动态读取配置，避免需要重载窗口
  const debugLogs = vscode.workspace.getConfiguration('kerneldev').get<boolean>('debugLogs', false);
  
  if (debugLogs) {
    args.unshift('vscode-ctags:');
    console.log(...args);
    channel.appendLine(args.join(' '));
  }
}

var _timeTypingRef: NodeJS.Timeout;
var _isTyping = false;
var _callBackShow: (e: vscode.TextDocumentChangeEvent) => void;
const _typeDelay = 1000;

vscode.workspace.onDidChangeTextDocument(ev => {
  _isTyping = true;
  
  clearTimeout(_timeTypingRef);
  
  _timeTypingRef = setTimeout(() => {
    _isTyping = false;

    if (_callBackShow != null) {
      _callBackShow(ev);
    }
  
  }, _typeDelay);
});

export function isTyping (call: (e: vscode.TextDocumentChangeEvent) => void): boolean {
  _callBackShow = call;
  return _isTyping;
}

export async function delay (miliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, miliseconds);
  });
}

/**
 * 获取工作区根路径，替代已弃用的 vscode.workspace.rootPath
 */
export function getWorkspaceRootPath(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

/**
 * 解析VSCode变量替换，使用与DTSEngine.ts相同的逻辑
 */
function resolveVSCodeVariables(input: string): string {
  return input.replace(/\${(.*?)}/g, (original, name: string) => {
    if (name === 'workspaceFolder') {
      return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? vscode.env.appRoot;
    }

    if (name.startsWith('workspaceFolder:')) {
      const folder = name.split(':')[1];
      return vscode.workspace.workspaceFolders?.find(w => w.name === folder)?.uri.fsPath ?? original;
    }

    return original;
  });
}

/**
 * 获取Linux内核路径，如果用户指定了内核路径则使用指定的路径，否则使用工作区根路径
 */
export function getKernelPath(): string | undefined {
  const config = vscode.workspace.getConfiguration('kerneldev');
  const kernelPath = config.get<string>('kernelPath', '');
  
  if (kernelPath && kernelPath.trim() !== '') {
    // 解析VSCode变量替换
    const resolvedPath = resolveVSCodeVariables(kernelPath);
    
    // 如果路径是相对路径，则相对于工作区根路径解析
    if (!path.isAbsolute(resolvedPath)) {
      const workspaceRoot = getWorkspaceRootPath();
      if (workspaceRoot) {
        const finalPath = path.resolve(workspaceRoot, resolvedPath);
        const normalizedPath = path.normalize(finalPath);
        return normalizedPath;
      }
    }
    
    const normalizedPath = path.normalize(resolvedPath);
    return normalizedPath;
  }
  
  return getWorkspaceRootPath();
}
