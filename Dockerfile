FROM node:14-alpine
RUN npm i -g npm@8.6.0 && \
    npm config set registry https://registry.npm.taobao.org && \
    npm i -g pnpm@6 pm2 && \
    pnpm i -g yarn
ADD ./ww-bill-service /app/service
ADD ./ww-bill-client /app/client
WORKDIR /app/client
RUN pnpm i && pnpm build:docker
WORKDIR /app/service
RUN yarn && yarn run build
EXPOSE 3001
CMD ["pm2-runtime", "start", "dist/main.js", "--name", "bill-h5"]
