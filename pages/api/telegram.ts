// pages/api/createUser.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createUserIfNotExists } from '../../lib/userUtils';

type TelegramMessage = {
  message?: {
    chat: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
    text: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message }: TelegramMessage = req.body;

    if (message && message.text === '/start') {
      const chatId = message.chat.id; // Using this as the user ID
      const responseMessage = 'Opening App...';
      const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

      // Extract user info from the Telegram message
      const { first_name, last_name, username } = message.chat;

      // Create or find the user in the database
      try {
        const user = await createUserIfNotExists({
          id: chatId, // Using chatId as the user ID
          firstname: first_name || 'Unknown',
          lastname: last_name || 'User',
          username: username || `user${chatId}`,
        });

        console.log('User created or found:', user);
      } catch (error) {
        console.error('Error creating or finding user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Respond to the Telegram message
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseMessage,
          reply_markup: {
            inline_keyboard: [[
              { text: 'Open App', web_app: { url: process.env.DOMAIN } }
            ]]
          },
        }),
      });

      return res.status(200).send('OK');
    } else {
      return res.status(400).send('Bad Request');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).send('Method Not Allowed');
  }
}
