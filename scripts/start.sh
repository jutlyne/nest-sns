#!/bin/sh

NODE_MODULE_DIR="./node_modules/"

if [ ! -d "$NODE_MODULE_DIR" ]; then
  echo "====== Installing dependencies ======"
  npm install
fi

echo "====== run project ======"
npm run start:dev