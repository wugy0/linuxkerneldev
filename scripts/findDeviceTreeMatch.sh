#!/bin/bash

echo "Searching 🏃 (Embedded Linux Dev)"

# find
if command -v rg >/dev/null 2>&1; then
    grepRet=$(rg -s "$2" "$1/drivers/" 2>/dev/null || echo "")
else
    grepRet=$(grep -rs "$2" "$1/drivers/" 2>/dev/null || echo "")
fi
fileList=(${grepRet//:/ })

# open
if [ "$fileList" != "" ]; then
	echo "Opening 📜 (Embedded Linux Dev)"
	eval "$3 -r $fileList"
else
	echo "Not found match for $2 😢 (Embedded Linux Dev)" 1>&2
	exit 42
fi

echo "Done 😎 (Embedded Linux Dev)"
