#!/usr/bin/env bash
apigeetool deploynodeapp \
-n generic_google_login \
-d ./ \
-m server.js \
-o <<apigee_edge_org>> \
-e <<apigee_edge_environment>> \
-b /generic_google_login \
-u <<your_apigee_edge_user_id@company.com>>

