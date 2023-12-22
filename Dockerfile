FROM node:14-alpine
RUN npm i -g npm@8.6.0 && \
    npm config set registry https://registry.npmmirror.com && \
    npm i -g pnpm@6 && \
    pnpm i -g yarn
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3001
CMD ["node", "dist/main.js"]
