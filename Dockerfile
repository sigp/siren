ARG node_version=18
ARG node_image=node:${node_version}

# STAGE 1: builder
FROM $node_image AS builder

COPY . /app/
WORKDIR /app

ENV NODE_ENV=development

# install (dev) deps
# on GitHub runners, timeouts occur in emulated containers
RUN yarn --network-timeout 300000

ENV NODE_ENV=production
# build (prod) app
RUN yarn build

# STAGE 2
FROM nginx:alpine AS production

COPY --from=builder /app/build/ /usr/share/nginx/html/
