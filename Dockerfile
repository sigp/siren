ARG node_version=18.18
ARG node_image=node:${node_version}

FROM $node_image AS builder

COPY . /app/

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development

WORKDIR /app
RUN yarn --network-timeout 300000
WORKDIR /app/backend
RUN yarn --network-timeout 300000

ENV NODE_ENV=production 

RUN yarn build 
WORKDIR /app
RUN yarn build

FROM node:${node_version}-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
RUN npm install --global pm2
RUN apk add -U nginx openssl

COPY ./docker-assets /app/docker-assets/
RUN rm /etc/nginx/http.d/default.conf; \
    ln -s /app/docker-assets/siren-http.conf /etc/nginx/http.d/siren-http.conf

COPY --from=builder /app/backend/package.json /app/backend/package.json
COPY --from=builder /app/backend/node_modules /app/backend/node_modules
COPY --from=builder /app/backend/dist /app/backend/dist

COPY --from=builder /app/siren.js /app/siren.js
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next /app/.next

ENTRYPOINT /app/docker-assets/docker-entrypoint.sh
