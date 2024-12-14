FROM node:20-alpine
RUN npm config set registry https://registry.npmmirror.com && \
    npm i -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i
COPY . .
RUN pnpm build
EXPOSE 3001
CMD ["node", "dist/src/main.js"]