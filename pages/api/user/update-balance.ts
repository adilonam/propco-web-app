import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { userId, addAmount } = req.body

  if (typeof userId !== 'number' || typeof addAmount !== 'number') {
    return res.status(400).json({ error: 'Invalid input types' })
  }

  try {

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) }, // Convert ID to BigInt
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser  = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { balance: (addAmount + user.balance) }
    })

    const serializedUser = Object.fromEntries(
      Object.entries(updatedUser ).map(([key, value]) => [key, String(value)])
    );

    res.status(200).json(serializedUser)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the balance' })
  }
}
