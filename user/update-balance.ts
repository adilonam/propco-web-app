import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { userId, newBalance } = req.body

  if (typeof userId !== 'number' || typeof newBalance !== 'number') {
    return res.status(400).json({ error: 'Invalid input types' })
  }

  try {
    const user = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { balance: newBalance }
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the balance' })
  }
}
