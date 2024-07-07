// pages/api/createUser.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createUserIfNotExists } from '../../lib/serverUtils';

type TelegramMessage = {
  message?: {
    chat: {
      id: number; // Telegram chat ID which is also the user ID in the case of private messages
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

    // Ensure we are handling a private chat and the start command
    if (message && message.text === '/start') {
      const chatId = BigInt(message.chat.id); // This is the user's Telegram ID, converted to BigInt
      const responseMessage = 'Opening App...';
      const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

      // Extract user info from the Telegram message
      const { first_name, last_name, username } = message.chat;

      // Create or find the user in the database
      try {
        const user = await createUserIfNotExists({
          id: chatId, // Using chatId from Telegram as the user ID (BigInt)
          firstname: first_name || 'Unknown',
          lastname: last_name || 'User',
          username: username || `user_${chatId}`,
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
          chat_id: message.chat.id, // Passing the original chatId without converting to BigInt
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
