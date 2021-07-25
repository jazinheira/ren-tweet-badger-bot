FROM node:latest

# Create directory.
RUN mkdir -p /usr/src/ren-tweet-badger-bot
WORKDIR /usr/src/ren-tweet-badger-bot

# Install.
COPY package.json /usr/src/ren-tweet-badger-bot
RUN npm install
COPY ./src/ /usr/src/ren-tweet-badger-bot/
COPY ./.env /usr/src/ren-tweet-badger-bot/

CMD ["node", "ren-tweet-badger-bot.js"]