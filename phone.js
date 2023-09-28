const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

const token_id = '6099543187:AAE6iilbCtbOVz-DaNHLmKKLJd8JgtCfE70';
const numberVerificationApiEndpoint = 'https://api.apilayer.com/number_verification/validate';
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/u/0/project/project-t-4b701/firestore/data/~2Ftelegram_data~2Ft7rn8s1TWYTf3nAGAMuz' 
});

const db = admin.firestore();

const bot = new TelegramBot(token_id, { polling: true });


bot.onText(/\/history/, async (mg) => {
  const chatId = mg.chat.id;

  try {
    const snapshot = await db.collection('telegram_data').orderBy('timestamp', 'desc').limit(10).get();
    if (snapshot.empty) {
      bot.sendMessage(chatId, 'HISTORY NOT FOUND');
    } else {
      let responseText = 'History:\n';
      snapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp.toDate().toLocaleString();
        responseText += `Timestamp: ${timestamp}\nChat ID: ${data.chatId}\nMessage Text: ${data.messageText}\nVerification Response: ${data.verificationResponse}\n\n`;
      });
      bot.sendMessage(chatId, responseText);
    }
  } catch (error) {
    bot.sendMessage(chatId, 'eRRRRRRRRRRRRRRRRROR.');
  }
});


bot.on('message', async (mg) => {
  const chatId = mg.chat.id;
  const messageText = mg.text;

  try {
    const queryParams = new URLSearchParams({ number: messageText });
    const requestOptions = {
      method: 'GET',
      headers: { apikey: 'Gt54EXsu51DU9vaY7Vc32VC8fo86R0dF' },
    };

    const resp = await fetch(`${numberVerificationApiEndpoint}?${queryParams}`, requestOptions);
    const result = await resp.text();

    const doref = db.collection('telegram_data').doc();
    await doref.set({
      chatId: chatId,
      messageText: messageText,
      verificationResponse: result,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    bot.sendMessage(chatId, `NUMBER VERIFICATION API RESPONSE: ${result}`);
  } catch (error) {
    bot.sendMessage(chatId, 'eRRRRRRRRRRRRRRRRRRROR');
  }
});