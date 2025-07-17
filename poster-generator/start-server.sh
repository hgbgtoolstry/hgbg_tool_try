#!/bin/bash

echo "Starting local server..."

# 检查Python3是否存在
if ! command -v python3 &> /dev/null
then
    echo "Error: Python 3 is not installed. Please install it to run the server."
    exit
fi

PORT=8000
echo ""
echo "Server is running at http://localhost:${PORT}"
echo "Opening the poster generator in your default browser..."
echo "Press Ctrl+C in this terminal to stop the server."
echo ""

# 根据操作系统选择打开浏览器的命令
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:${PORT}" &
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:${PORT}" &
fi

# 启动服务器
python3 -m http.server ${PORT}
