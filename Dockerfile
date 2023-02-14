ARG node_version=16.16
ARG node_image=node:${node_version}

# STAGE 1: builder
FROM $node_image AS builder

COPY . /app/
WORKDIR /app

ENV NODE_ENV=development
# install (dev) deps
RUN yarn 

ENV NODE_ENV=production
# build (prod) app
RUN yarn build

# STAGE 2
FROM nginx:alpine AS production

COPY --from=builder /app/build/ /usr/share/nginx/html/
