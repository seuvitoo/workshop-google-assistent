'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  BasicCard,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});


// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('cor favorita', (conv, {color}) => {
  const luckyNumber = color.length;
  // Respond with the user's lucky number and end the conversation.
  if (conv.data.userName) {
    conv.ask(`
    <speak>
    ${conv.data.userName}, seu número da sorte é ${luckyNumber}
    <audio src="https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"></audio>
    Você quer saber sobre cores exóticas?
    </speak>
    `
    );
    conv.ask(new Suggestions('Sim', 'Não'));
  } else {
    conv.ask(`
    <speak>
    Maaaaano! Seu número da sorte é ${luckyNumber}
    <audio src="https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"></audio>
    Você quer saber sobre cores exóticas?
    </speak>
    `);
    conv.ask(new Suggestions('Sim', 'Não'));
  }
});

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
  conv.ask(new Permission({
    context: 'Olá, só para te conhecer melhor',
    permissions: 'NAME',
  }));
});

app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    conv.ask(`Sem prolemas. Qual sua cor favorita?`);
    conv.ask(new Suggestions('Azul', 'Vermelho', 'Verde'));
  } else {
    conv.data.userName = conv.user.name.display;
    conv.ask(`Olá ${conv.data.userName}. Qual sua cor favorita?`);
    conv.ask(new Suggestions('Azul', 'Vermelho', 'Verde'));
  }
});

app.intent('cor exotica favorita', (conv, {corLouca,
}) => {
  // Present user with the corresponding basic card and end the conversation.
  conv.close(`Aqui está sua cor`, new BasicCard(colorMap[corLouca]));
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
