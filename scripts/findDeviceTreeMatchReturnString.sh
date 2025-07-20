#!/bin/bash
# usage: ./findDeviceTreeMatchReturnString.sh <workspace_path> <compatible_string>

if [ $# -lt 2 ]; then
    exit 1
fi

if [ ! -d "$1/drivers" ]; then
    exit 0
fi

if command -v rg >/dev/null 2>&1; then
    grepRet=$(rg -n --type c "$2" "$1/drivers/" 2>/dev/null || echo "")
else
    grepRet=$(grep -nrs --include=\*.c "$2" "$1/drivers/" 2>/dev/null || echo "")
fi

echo "$grepRet"
