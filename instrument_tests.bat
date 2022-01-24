SET EXITCODE=0

echo "Checking git status..."

rem Stuff the machine-readable result of git status into a variable
FOR /F "tokens=* USEBACKQ" %%F IN (`git status --porcelain`) DO (
SET gst=%%F
)
rem Check that working copy is clean before continuing
IF "%gst%"=="" ( 
  echo Git status clean - continuing
) ELSE (
  echo You have uncommitted changes or untracked files, probably because you just ran expo run:android, expo run:ios, or both!
  echo This script requires your 'ejected' native files to be committed first. Please commit them and then re-run this script.
  echo Exiting without instrumenting.
  EXIT /B 1
)

rem install Detox itself
echo Installing Detox - if this fails for any reason (e.g. network outage) you can safely just re-run this script

yarn add -D detox@18.19.0
if ERRORLEVEL 1 goto Failed

rem Give students time to register the above message before the flurry of git messages
timeout /t 2 

echo Applying test instrumentation changes - if you see a git error, shout for help!

rem Give students time to register the above message before the flurry of git messages
timeout /t 2 

rem Add test instrumentation commits
rem 
rem We cherry pick commits rather than scripting the modifications so that any
rem conflicts are raised by Git, rather than occurring silently and then causing
rem build/run errors
rem
rem After each cherry pick we check whether it applied cleanly and exit the script if not
git cherry-pick detox_setup_configure
if ERRORLEVEL 1 goto Failed

rem If android native code has been ejected, instrument it
if exist android\ git cherry-pick detox_setup_android
if ERRORLEVEL 1 goto Failed

rem If ios native code has been ejected, instrument it
if exist ios\  git cherry-pick detox_setup_ios
if ERRORLEVEL 1 goto Failed

git cherry-pick detox_setup_sample_test
if ERRORLEVEL 1 goto Failed

echo Everything applied ok! You may now continue with the test lesson.
goto Success

:Failed
set EXITCODE=1
:Success
EXIT /B %EXITCODE%
