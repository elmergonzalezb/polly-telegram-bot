polly-telegram-bot
==================

This project uses [yagop's node telegram bot api](https://github.com/yagop/node-telegram-bot-api)
and [lesterchan's telegram bot and aws lambda guide](https://github.com/lesterchan/telegram-bot).

By the end of the setup section you will have a Telegram bot that will take the text message you
send it and reply with an audio file of that text message.

The AWS API version is locked to `2016-06-10`.

# Getting Started

```sh
$ git clone https://github.com/marcusmolchany/polly-telegram-bot.git
$ cd polly-telegram-bot
$ npm install
```

# Usage

Once your bot is running it will respond to commands of the following two formats:

1. Any text message
2. A text message that starts with the slash command of the name of a Polly voice. For example: `/Nicole Hello there`.

The list of supported AWS Polly voices is in [`voice-ids.js`](https://github.com/marcusmolchany/polly-telegram-bot/blob/master/voice-ids.js).

## Sample Commands
```
"The arsonist had oddly shaped feet."
"/Nicole hello there."
"/Brian good morning."
"/Celine quoi de neuf?"
```

# Setup

Follow the steps outlined in [lesterchan's telegram bot](https://github.com/lesterchan/telegram-bot)
guide to:

* create a Telegram Bot using BotFather
* create an AWS Lambda function through the AWS Console
* connect your Lambda function with an API Gateway through the AWS Console
* set your telegram webhook

Instead of cloning lesterchan's repository you will use this one for the code in your lambda
function.

You will need to use this command from his setup to generate a zip file of your project to upload
to your AWS Lambda function (the generated file is git ignored):
```sh
$ zip -r telegram-bot.zip *.js node_modules/*
```

## Telegram - Bot Token

Copy `token.sample.js` into `token.js`. Copy the Telegram bot token given to you by BotFather and
replace the text `YOURTELEGRAMBOTTOKEN` with your bot token. `token.js` is git ignored.

```sh
$ cp token.sample.js token.js
```

## AWS - Access Keys

Configure access keys following [this guide](https://aws.amazon.com/developers/access-keys/).
You will need the access keys `AmazonS3FullAccess` and `AmazonPollyFullAccess` set for your user.
Copy `creds.sample.js` into `creds.js` and store your `accessKeyId` and `secretAccessKey` into
the `credentials` object. `creds.js` is git ignored.

Set your `region` to whichever region your lambda function is running from.

```sh
$ cp creds.sample.js creds.js
```

# Resources
### AWS
https://github.com/aws/aws-sdk-js

http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS.html

### Polly
http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html

https://trevorsullivan.net/2016/12/01/amazon-aws-cloud-polly-nodejs/

### S3
http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html

### Others
https://github.com/Tim-B/grunt-aws-lambda/issues/18

http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html#getting-started-nodejs-run-sample

https://github.com/awslabs/aws-nodejs-sample/blob/master/sample.js
