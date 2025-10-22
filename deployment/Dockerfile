FROM node:16-slim AS builder 

RUN mkdir -p /app
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install -f

# Build the app
COPY . .
RUN npm run build

# Run the app
#FROM nginx:1.19.0
#COPY nginx.conf /tmp/docker.nginx
#WORKDIR /usr/share/nginx/html
#COPY --from=builder /app/dist .
#COPY --from=builder /app/dist /usr/share/nginx/html
#ENTRYPOINT ["nginx", "-g", "daemon off;"]

#FROM nginx:1.17.1-alpine
## COPY nginx.conf /etc/nginx/nginx.conf
#ARG NGINX_API
#COPY nginx.conf /tmp/docker.nginx
#
#COPY --from=builder /app/dist /usr/share/nginx/html


### STAGE 2: Run ###
FROM nginx:1.23.3-alpine
ARG NGINX_API
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

COPY ./public /usr/share/nginx/html/public

COPY ./.env.sh /.env.sh
RUN chmod +x /.env.sh

CMD /.env.sh && nginx -g "daemon off;"