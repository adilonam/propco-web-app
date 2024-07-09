// pages/api/createUser.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createUserIfNotExists } from '../../lib/serverUtils';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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


function extractNumberFromStartCommand(text: string): bigint | null {
  // Regular expression to match '/start' followed by a space and a number
  const match = text.match(/^\/start (\d+)$/);
  if (match) {
    const number = BigInt(match[1]); // Convert the matched number to a BigInt
    return number;
  } else {
    return null; // No number found after /start
  }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const { message }: TelegramMessage = req.body;
    const reward = 100
    console.log(req.body);
    // Ensure we are handling a private chat and the start command
    if (message && (message.text.startsWith('/start'))) {
      const chatId = BigInt(message.chat.id); // This is the user's Telegram ID, converted to BigInt


      // Extract user info from the Telegram message
      const { first_name, last_name, username } = message.chat;

      // Create or find the user in the database
      try {
        const { user, created } = await createUserIfNotExists({
          id: chatId, // Using chatId from Telegram as the user ID (BigInt)
          firstname: first_name || 'Unknown',
          lastname: last_name || 'User',
          username: username || `user_${chatId}`,
        });



        console.log('User created or found:', user);


        // rewards
        const number = extractNumberFromStartCommand(message.text);
        if (number !== null && !created) {
          try {

            const user = await prisma.user.findUnique({
              where: { id: BigInt(number) }, // Convert ID to BigInt
            });


            if (user) {
              const updatedUser = await prisma.user.update({
                where: { id: number },
                data: { balance: (reward + user.balance) }
              })
              console.log('User has reward ' + reward, updatedUser);
            }

          } catch (error) {
            console.log('An error occurred while updating the reward balance');
          }
        }
        // Respond to the Telegram message
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: message.chat.id, // Passing the original chatId without converting to BigInt
            text: "🌟 Welcome to the Ultimate PROPCO Token App! 🌟\n\n🚀 Buy Propco on Bitmart 🌐\nInvest in the future today! Click the link below to buy your Propco tokens and be part of the revolution:\n👉 https://www.bitmart.com/trade/en-US?symbol=PROPCO_USDT\n\n📢 Join the Official Channel 🕸️\nStay updated with the latest news, updates, and community discussions. Join us on Telegram:\n👉 https://t.me/propco\n\n🎉 Get Rewarded 🎉\nEarn Propco for free! Participate in various activities and tasks to get rewarded. The more you engage, the more you earn!\n\n👯‍♂️ Refer a Friend\nSpread the word! When your friends buy Propco, you get rewarded in Propco. Double the benefits, double the fun. Let's create a community of like-minded investors!\n\n🌔 Take Us to the Moon! 🌕\nBe a part of our journey to the moon. Your support can take us higher than ever before. Join the movement and watch your investment soar!",
            reply_markup: {
              inline_keyboard: [[
                { text: 'Open App', web_app: { url: `${process.env.DOMAIN}/${user.id}` } }
              ]]
            },
          }),

        });
      } catch (error) {
        console.error('Error creating or finding user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }



      return res.status(200).send('OK');
    } else {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: message?.chat.id,
          text: "Bad Request.",
        }),
      });
      return res.status(200).send('Ok');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).send('Method Not Allowed');
  }
}
