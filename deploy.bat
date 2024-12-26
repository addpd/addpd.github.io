@echo off
setlocal
chcp 65001 > nul

rem 记录开始时间
for /F "tokens=1-4 delims=:.," %%a in ("%time%") do (
    set /A start_time=%%a*3600 + %%b*60 + %%c
)

if not exist "log" mkdir log

REM 删除7天之前的日志文件
powershell -Command "Get-ChildItem -Path 'log' -Filter 'deploy_*.log' | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item -Force"

REM 获取英文格式的日期和时间
for /f "skip=1 tokens=2 delims==" %%a in ('wmic os get localdatetime /format:list') do set datetime=%%a
set TIMESTAMP=%datetime:~0,8%_%datetime:~8,6%

echo [信息] 部署中...

REM 使用 powershell 进行 UTF-8 输出重定向
powershell -Command "npm run deploy *>&1 | Out-File -Encoding UTF8 'log\deploy_%TIMESTAMP%.log'"

echo [信息] 部署日志已保存到: log\deploy_%TIMESTAMP%.log

rem 记录结束时间
for /F "tokens=1-4 delims=:.," %%a in ("%time%") do (
    set /A end_time=%%a*3600 + %%b*60 + %%c
)

rem 计算时间差
set /A elapsed_time=end_time-start_time

rem 处理跨午夜的情况
if %elapsed_time% lss 0 set /A elapsed_time+=86400

echo 部署总花费时间: %elapsed_time% 秒 >> log\deploy_%TIMESTAMP%.log

endlocal