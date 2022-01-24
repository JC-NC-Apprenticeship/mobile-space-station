#!/usr/bin/env sh

# Exit as soon as a command errors
set -e

echo "Checking git status..."
if [ -z "$(git status --porcelain)" ]; then 
  echo "Git status clean - continuing"
else 
  echo
  echo "You have uncommitted changes or untracked files, probably because you just ran expo run:android, expo run:ios, or both!"
  echo
  echo "This script requires your 'ejected' native files to be committed first. Please commit them and then re-run this script."
  echo
  echo "Exiting without instrumenting."
  exit 1
fi

# Install Detox itself
echo "Installing Detox - if this fails for any reason (e.g. network outage) you can safely just re-run this script"
echo

yarn add -D detox@18.19.0

# Give students time to register the above message before the flurry of git messages
sleep 2 

echo "Applying test instrumentation changes - if you see a git error, shout for help!"
echo

# Give students time to register the above message before the flurry of git messages
sleep 2

# Add test instrumentation commits
# 
# We cherry pick commits rather than scripting the modifications so that any
# conflicts are raised by Git, rather than occurring silently and then causing
# build/run errors
git cherry-pick detox_setup_configure

# If android native code has been ejected, instrument it
if [ -d "android" ]; then
  git cherry-pick detox_setup_android
fi

# If ios native code has been ejected, instrument it
if [ -d "ios" ]; then
  git cherry-pick detox_setup_ios
fi

git cherry-pick detox_setup_sample_test

echo 
echo "Everything applied ok! You may now continue with the test lesson."
