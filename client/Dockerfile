FROM node:16-alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "build"]

FROM nginx
# copy nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# copy build assets from previous step
COPY --from=builder /app/build /usr/share/nginx/html
