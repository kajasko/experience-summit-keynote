#!/bin/bash
# ZALOHA. Hlavni zpusob: dvojklik na Prezentace_Experience_Summit.html (nepotrebuje server).
cd "$(dirname "$0")" || exit 1
exec python3 keynote_server.py
