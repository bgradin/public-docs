#!/bin/bash

set -e

node scripts/download-folder.js
node scripts/copy-identity.js
mkdocs build -f ./files/mkdocs.yml -d ../dist
