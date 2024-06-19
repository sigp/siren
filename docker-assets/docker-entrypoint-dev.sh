#!/bin/bash 

set -a; \
. /app/.env; \
set +a

if [ $SSL_ENABLED = true ] ; then 
  ## generate cert if not present 
  if [ ! -f /certs/cert.pem ] ; then 
    openssl req -x509 -newkey rsa:4096 -keyout /certs/key.pem -out /certs/cert.pem -days 365 -passout pass:'sigmaprime' -subj "/C=AU/CN=siren/emailAddress=noreply@sigmaprime.io"
    echo 'sigmaprime' > /certs/key.pass
  fi
  ## nginx ssl stuff
    ln -s /app/docker-assets/siren-https.conf /etc/nginx/conf.d/siren-https.conf
fi

nginx & 

cd /app/backend
yarn start & 

cd /app

yarn dev
