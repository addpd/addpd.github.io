@echo off
chcp 65001 > nul
if not exist "log" mkdir log

REM 删除7天之前的日志文件
powershell -Command "Get-ChildItem -Path 'log' -Filter 'deploy_*.log' | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item -Force"

REM 获取英文格式的日期和时间
for /f "skip=1 tokens=2 delims==" %%a in ('wmic os get localdatetime /format:list') do set datetime=%%a
set TIMESTAMP=%datetime:~0,8%_%datetime:~8,6%


REM 使用 powershell 进行 UTF-8 输出重定向
powershell -Command "npm run deploy *>&1 | Out-File -Encoding UTF8 'log\deploy_%TIMESTAMP%.log'"

echo [信息] 部署日志已保存到: log\deploy_%TIMESTAMP%.log