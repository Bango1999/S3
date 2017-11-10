@echo off
If Not Exist updater.hashfile call certUtil -hashfile config.js md5 > updater.hashfile
call certUtil -hashfile config.js md5 > updater_temp.hashfile
call FC updater.hashfile updater_temp.hashfile >NUL && set stash=0 || set stash=1
if "%stash%" == "1" (call git stash)
pause
call git pull origin master
if "%stash%" == "1" (call git stash apply)
call npm update
del /f updater_temp.hashfile
pause