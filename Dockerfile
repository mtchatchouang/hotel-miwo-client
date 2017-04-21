FROM nginx:stable-alpine

COPY devops/nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/src/app/