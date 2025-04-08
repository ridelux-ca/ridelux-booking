#!/bin/bash

SCRIPT_PATH="$(pwd)/ios/App/Pods/Target Support Files/Pods-App/Pods-App-frameworks.sh"

echo "🛠️ Running safe-pods-wrapper.sh"
echo "🔍 Checking script path: $SCRIPT_PATH"

if [ -r "$SCRIPT_PATH" ]; then
  echo "✅ Script is readable, executing..."
  /bin/bash -l "$SCRIPT_PATH"
  RESULT=$?
  echo "📦 Pods script exited with code: $RESULT"
  exit $RESULT
else
  echo "❌ Could not read $SCRIPT_PATH: Permission denied"
  exit 1
fi

