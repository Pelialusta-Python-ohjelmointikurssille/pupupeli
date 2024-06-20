#!/bin/bash
pushd /pupuproxy
npm install
popd

python3 /pupupeli/server.py &
node /pupuproxy/proxy.js