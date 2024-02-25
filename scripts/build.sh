#!/bin/bash

set -euo pipefail

node scripts/download-folder.js
mkdocs build -f ./files/mkdocs.yml -d ../dist
