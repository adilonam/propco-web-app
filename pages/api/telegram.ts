import type { NextApiRequest, NextApiResponse } from 'next';

type TelegramMessage = {
  message?: {
    chat: {
      id: number;
    };
    text: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message }: TelegramMessage = req.body;

    if (message && message.text === '/start') {
      const chatId = message.chat.id;
      const responseMessage = 'Opening Google...';
      const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseMessage,
          reply_markup: {
            keyboard: [[
              { text: 'Open Google', web_app : {url: 'https://google.com' }}
            ]]
          },
        }),
      });
    }
    
    res.status(200).send('OK');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
