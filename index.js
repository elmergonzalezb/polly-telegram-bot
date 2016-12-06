var AWS = require('aws-sdk');
var TelegramBot = require('node-telegram-bot-api');
var request = require('request');

var creds = require('./creds.js');
var token = require('./token.js');
var voiceIds = require('./voice-ids.js');

var bot = new TelegramBot(token);

AWS.config = new AWS.Config(creds);

// lock api version to 2016-06-10
var s3 = new AWS.S3({ apiVersion: '2016-06-10' });
var polly = new AWS.Polly({ apiVersion: '2016-06-10' });


exports.handler = (event, context) => {
  var chatId = null;
  var message = '';
  var firstWord = '';
  var voiceId = 'Russell'; // default voice id

  if (event.body.message.chat && event.body.message.chat.id) {
    chatId = event.body.message.chat.id;
  }

  if (event && event.body && event.body.message && event.body.message.text) {
    message = event.body.message.text.trim();
  }

  // extract the first word of the message to see if it is a command
  firstWord = message.split(' ')[0];
  if (firstWord[0] === '/') {
    firstWord = firstWord.slice(1); // remove the slash from the command
  }

  firstWord = firstWord[0].toUpperCase() + firstWord.slice(1); // capitalize the first letter

  // check if the first word is in the list of voice ids
  if (voiceIds.indexOf(firstWord) !== -1) {
    voiceId = firstWord;
    message = message.split(' ').slice(1).join(' '); // remove first word from message
  }

  var pollyParams = {
    // OutputFormat: 'ogg_vorbis', todo: convert ogg vorbis to ogg opus so .sendVoice() will work
    OutputFormat: 'mp3',
    Text: message,
    VoiceId: voiceId,
    LexiconNames: [],
    SampleRate: '16000',
    TextType: 'text'
  };

  polly.synthesizeSpeech(pollyParams, (err, data) => {
    if (err) {
      bot.sendMessage(chatId, 'error with polly synthesizeSpeech.');
    }

    var uploadParams = {
      Bucket: 'pollybot',
      Key: 'file-' + Date.now() + '.mp3',
      ACL: 'public-read',
      Body: data.AudioStream,
      Expires: new Date(Date.now() + 1800000) // 1800000ms is 30 minutes
    };

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log('s3 upload error', err);
        bot.sendMessage(chatId, err);
      } else if (data) {
        console.log('s3 upload success', data);
        var audio = request(data.Location);
        bot.sendChatAction(chatId, 'upload_audio');
        bot.sendAudio(chatId, audio);
      }
    });
  });
}