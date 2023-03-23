ARG node_version=18
ARG node_image=node:${node_version}

# STAGE 1: builder
FROM $node_image AS builder

COPY . /app/
WORKDIR /app

ENV NODE_ENV=development

# cross-builds timeout on downloading deps for some reason
RUN yarn config set network-timeout 300000

# install (dev) deps
RUN yarn

ENV NODE_ENV=production
# build (prod) app
RUN yarn build

# STAGE 2
FROM nginx:alpine AS production

COPY --from=builder /app/build/ /usr/share/nginx/html/