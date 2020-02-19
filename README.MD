Setting up:

```
heroku create salat10 --buildpack heroku/nodejs
git push heroku master
```

Your .env file should specify the following:

```
NODE_ENV=development
PORT=5000
GEOCODER_PROVIDER=mapquest
GEOCODER_API_KEY=nrv

# https://timezonedb.com/account
TIMEZONE_API_KEY=6076

# Get this from BotFather
BOT_API_KEY=564540216:AAExIbgPTjoiJQeGBEG4AGB5hRAEPyKUks8

# Get this from the Telegram group ID to post the bug reports into
CONTACT_CHAT_ID=-386690093

# The app URL for Heroku
HEROKU_APP_URL=https://salat10.herokuapp.com

# https://sentry.io/ilmtest/salat10-bot/getting-started/node/
SENTRY_DSN=https://abcd@sentry.io/12345

# from https://app.segment.com/llm-test/sources/salat10_bot/overview
SEGMENT_IO_WRITE_KEY=abcdefg

# This is needed to fix a node-telegram-bot-api warning
NTBA_FIX_319=1
```
