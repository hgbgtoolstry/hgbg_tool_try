@echo off
echo Starting local server...

set "START_PORT=8000"
set "AVAILABLE_PORT="

:CHECK_PORT
netstat -ano | findstr :%START_PORT% >nul 2>&1
if %errorlevel% equ 0 (
    echo Port %START_PORT% is already in use. Trying the next port...
    set /a START_PORT+=1
    goto CHECK_PORT
) else (
    set "AVAILABLE_PORT=%START_PORT%"
)

REM 尝试使用 py (Python启动器)，如果失败则尝试 python
py -m http.server %AVAILABLE_PORT% >nul 2>&1
if %errorlevel% neq 0 (
    python -m http.server %AVAILABLE_PORT% >nul 2>&1
    if %errorlevel% neq 0 (
        echo.
        echo Error: Python is not installed or not in your PATH.
        echo Please install Python from python.org to run this server.
        pause
        exit /b
    )
)

echo.
echo Server is running at http://localhost:%AVAILABLE_PORT%
echo Opening the poster generator in your default browser...
echo Press Ctrl+C in this window to stop the server.
echo.

REM 自动在浏览器中打开页面
start http://localhost:%AVAILABLE_PORT%

REM 保持窗口开启，显示服务器日志
py -m http.server %AVAILABLE_PORT%