FROM node:16

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn

COPY . . 

RUN yarn build

ENTRYPOINT [ "yarn", "start" ]