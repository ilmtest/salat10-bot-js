Setting up:

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

# https://sentry.io/ilmtest/salat10-bot/getting-started/node/
SENTRY_DSN=https://abcd@sentry.io/12345

# from https://app.segment.com/llm-test/sources/salat10_bot/overview
SEGMENT_IO_WRITE_KEY=abcdefg

# This is needed to fix a node-telegram-bot-api warning
NTBA_FIX_319=1
```

# Serverless Hosting Steps:

## Creating Lambda function

1. Go to AWS Console
2. [Go to AWS Lambda](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions)
3. Under the `Functions` tab, click `Create Function` in the top-right.
4. Select `Author From Scratch`.
5. In the `Basic Information`, under `Function name` field enter: `Salat10Bot`.
6. The Runtime should be `NodeJS 12.x`.
7. Click `Create Function`.

## Setting up API Gateway

1. Click `Services` tab in AWS (in the top-left) in the search field search for `API Gateway` and select it.
2. Click `Build` under `REST API` (not the private one).
3. Protocol should be `REST`
4. Under `Create new API` select `New API`.
5. For API name, choose `Salat10 Bot API`.
6. Under description put: `Telegram Bot`.
7. Leave Endpoint as `Regional`.
8. Click `Create API`.
9. Under the `Resources` tab, click the `Actions` button, and choose `Create Method`.
10. In the dropdown choose `POST` then click the Checkmark button. We selected the `POST` method because Telegram's `setWebhook` calls our API with a POST webhook with the payload for each message.
11. Under `Integration Type` leave it as `Lambda function`.
12. Check the box for `Proxy Integration` to set it to be enabled.
13. In the Lambda function field, type the field name you created before and select it.
14. Then click on `Save`.
15. Click `OK` on the confirmation dialog.
16. Once it is done, click the `Actions` button and choose `Deploy API`.
17. Under `Deployment Stage` choose `New Stage`.
18. Enter a Stage name (ie: `v1`).
19. Click `Deploy`.
20. Make note of the `Invoke URL` that gets generated which will look something like: `https://abcd.execute-api.us-east-1.amazonaws.com/v1` This is the link that will invoke the Lambda function.

## Deploying our app to AWS

1. Zip the following files/folders into an archive called `index.zip`:

-   src folder
-   package.json
-   index.js

2. In the AWS Lambda console, click the Salat10 Bot you created.
3. You should notice the bot is now linked to the API gateway.
4. Scroll down, under `Function code`, select `Upload a .zip file` for the `Code entry type`.
5. Click the `Upload` button and choose the `index.zip` you created.
6. Under `Environment Variables`, paste all the ones from your `.env` file into there.
7. Once it is done, click the `Save` button in the top-right.

## Preparing the node_modules folder for AWS Lambda

1. Create an empty folder in the `IlmTest-bot` project called `nodejs`. This must be exactly this.
2. Copy the `node_modules` folder inside the `nodejs` folder.
3. Zip the `nodejs` folder.
4. In the AWS Lambda console, click on the left sidebar and choose `Layers`.
5. Then click `Create Layer`.
6. Name the Layer: `IlmTest-bot-packages`.
7. Under description put: `node_modules for IlmTest`
8. Click `Upload a zip file` and the `Upload` button.
9. Choose the `nodejs.zip`.
10. Choose `Nodejs 12.x` for the runtime.
11. Click `Create`.
12. Head over to `Functions` in the left side bar on AWS Lambda.
13. Click Salat10 Bot.
14. Click on the `Layers` area.
15. Click `Add Layer`.
16. Use `Select from a list of runtime compatible layers`.
17. Under the Name choose the layer you just created (ie: `IlmTest-bot-packages`).
18. Select `1` for `Version`.
19. Click `Add`.
20. Click `Save` at the top-right.

## Setting Webhook

1. Go to AWS console, under services choose `API Gateway`.
2. Choose the `Salat10 Bot API`.
3. On the left-sidebar choose `Stages`.
4. Then click on `v1`.
5. Copy the `Invoke URL`.
6. Paste it into the following template replacing each constant:
   `https://api.telegram.org/bot49012:AAFagqXVAOLFd8bSwqx-9Hi2xkU/setWebhook?url=https://abcd.execute-api.us-east-1.amazonaws.com/v1`
7. Copy and paste that in your browser to go to the URL.
8. You should get a response:

```
{"ok":true,"result":true,"description":"Webhook was set"}
```

## To stop the webhook you just need to hit:

1. `https://api.telegram.org/bot{BOT_API_KEY}/setWebhook`
2. You should get a response:

```
{"ok":true,"result":true,"description":"Webhook was deleted"}
```

This app was built using the Udemy course: [Build Telegram Bots with JavaScript The Complete Guide](https://www.udemy.com/course/build-telegram-bots-with-javascript-the-complete-guide)
