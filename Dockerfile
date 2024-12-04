ARG node_version=18.18
ARG node_image=node:${node_version}

FROM $node_image AS builder

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=development
WORKDIR /app
COPY . /app/

RUN yarn --network-timeout 300000; \
    NODE_ENV=production yarn build
WORKDIR /app/backend
RUN yarn --network-timeout 300000; \
    NODE_ENV=production yarn build

FROM alpine AS intermediate

COPY ./docker-assets /app/docker-assets/

COPY --from=builder /app/backend/package.json /app/backend/package.json
COPY --from=builder /app/backend/node_modules /app/backend/node_modules
COPY --from=builder /app/backend/dist /app/backend/dist

COPY --from=builder /app/siren.js /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next /app/.next

FROM $node_image AS production

ENV NODE_ENV=production
RUN npm install --global pm2; \
    apt update; \
    apt install -y nginx openssl curl ncat

RUN rm /etc/nginx/sites-enabled/default; \
    ln -s /app/docker-assets/siren-http.conf /etc/nginx/conf.d/siren-http.conf

COPY --from=intermediate /app /app/

ENTRYPOINT ["/app/docker-assets/docker-entrypoint.sh"]
