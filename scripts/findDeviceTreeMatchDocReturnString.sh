#!/bin/bash
# usage: ./findDeviceTreeMatchDocReturnString.sh <workspace_path> <compatible_string>

if [ $# -lt 2 ]; then
    exit 1
fi

if [ ! -d "$1/Documentation/devicetree/bindings" ]; then
    exit 0
fi

if command -v rg >/dev/null 2>&1; then
    # 使用ripgrep，输出格式与grep兼容
    grepRet=$(rg -s "$2" "$1/Documentation/devicetree/bindings/" 2>/dev/null || echo "")
else
    # 使用传统grep
    grepRet=$(grep -rs "$2" "$1/Documentation/devicetree/bindings/" 2>/dev/null || echo "")
fi

echo "$grepRet"
