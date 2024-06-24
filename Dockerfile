ARG node_version=18.18
ARG node_image=node:${node_version}

FROM $node_image AS builder

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production
WORKDIR /app
COPY . /app/

RUN yarn --network-timeout 300000; \
    yarn build
WORKDIR /app/backend
RUN yarn --network-timeout 300000; \
    yarn build

FROM alpine AS intermediate

COPY ./docker-assets /app/docker-assets/

COPY --from=builder /app/backend/package.json /app/backend/package.json
COPY --from=builder /app/backend/node_modules /app/backend/node_modules
COPY --from=builder /app/backend/dist /app/backend/dist

COPY --from=builder /app/siren.js /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next /app/.next

FROM node:${node_version}-alpine AS production

ENV NODE_ENV=production
RUN npm install --global pm2; \
    apk add -U nginx openssl curl

RUN rm /etc/nginx/http.d/default.conf; \
    ln -s /app/docker-assets/siren-http.conf /etc/nginx/http.d/siren-http.conf

COPY --from=intermediate /app /app/

ENTRYPOINT /app/docker-assets/docker-entrypoint.sh