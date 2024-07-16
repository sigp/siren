#!/bin/bash

# configure default vars if none provided
set -a 
PORT=${PORT:-3000}
BACKEND_URL=${BACKEND_URL:-http://127.0.0.1:3001}
BEACON_URL=${BEACON_URL:-http://your-BN-ip:5052}
VALIDATOR_URL=${VALIDATOR_URL:-http://your-VC-ip:5062}
API_TOKEN=${API_TOKEN:-"get-it-from-'.lighthouse/validators/api-token.txt'"}
SESSION_PASSWORD=${SESSION_PASSWORD:-default-siren-password}
SSL_ENABLED=${SSL_ENABLED:-true}
DEBUG=${DEBUG:-false}
set +a

# if bn/vc api unreachable, print message and exit
tests="${BEACON_URL} ${VALIDATOR_URL}"
for test in $tests; do 
  host="${test#*//}"
  host="${host%%:*}"
  port="${test##*:}"
  nc -z $host $port

  if [ $? -eq 1 ]; then
    printf "${test} unreachable, check settings and connection\n"
    fail=true
  fi
done
# check api token
api_response_code=$(curl -sIX GET "${VALIDATOR_URL}/lighthouse/version" -H "Authorization: Bearer ${API_TOKEN}" | head -n 1 | awk '{print $2}')
if [ "$api_response_code" != '200' ]; then
  printf "validator api issue, server response: %s \n" "${api_response_code:-no_response}"  
  fail=true
fi

if [ $fail ]; then  exit 1; fi

if [ $SSL_ENABLED = true ] ; then
  ## generate cert if not present
  if [ ! -f /certs/cert.pem ] ; then
    mkdir -p /certs
    openssl req -nodes -x509 -newkey rsa:4096 -keyout /certs/key.pem -out /certs/cert.pem -days 365 -subj "/C=AU/CN=siren/emailAddress=noreply@sigmaprime.io"
  fi
  ln -s /app/docker-assets/siren-https.conf /etc/nginx/conf.d/siren-https.conf
fi


# test config, start nginx 
nginx -t && nginx &

# start backend
cd /app/backend
PM2_HOME='~/.pm2-backend' pm2-runtime yarn --interpreter sh -- start:prod &

# start frontend
cd /app
PM2_HOME='~/.pm2-frontend' pm2-runtime yarn --interpreter sh -- start
