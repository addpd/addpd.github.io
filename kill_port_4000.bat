@echo off
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do (
    if not "%%a"=="0" (
        echo Closing process with PID %%a
        taskkill /PID %%a /F
    )
)
