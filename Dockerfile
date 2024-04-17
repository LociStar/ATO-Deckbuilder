# Stage 1 - the build process
FROM node:21 as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2 - the production environment
FROM node:21
COPY --from=build-deps /usr/src/app/dist /app
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "/app", "-l", "80"]