const axios = require('axios');

const expoTokens = [
  'ExponentPushToken[t_4YX7HRZ0Gnh9tA7CspQR]',
  'ExponentPushToken[t_4YX7HRZ0Gnh9tA7CspQR]',
  'ExponentPushToken[t_4YX7HRZ0Gnh9tA7CspQR]',
];

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await axios('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    data: message,
  });

  return 'Success';
}

const bulkSendMessage = async () => {
  try {
    const response = await Promise.all(
      expoTokens.map(async (token) => {
        return await sendPushNotification(token);
      })
    );
    // sendPushNotification().then((response) => {
    //   console.log(response);
    // });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

bulkSendMessage()
