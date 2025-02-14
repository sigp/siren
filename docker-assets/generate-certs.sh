#!/bin/sh
set -e

# Create directory for certificates if it doesn't exist
mkdir -p /etc/nginx/certs

# Generate self-signed certificate and private key
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
    -keyout /etc/nginx/certs/nginx.key \
    -out /etc/nginx/certs/nginx.crt \
    -subj "/C=AU/CN=siren/emailAddress=noreply@sigmaprime.io"

# Set proper permissions
chmod 600 /etc/nginx/certs/nginx.key
chmod 644 /etc/nginx/certs/nginx.crt

echo "SSL certificates generated successfully"
