// pages/api/user/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Check if the ID is provided
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: BigInt(id as string) }, // Convert ID to BigInt
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    

   // Convert BigInt properties to strings for JSON serialization
   const serializedUser = {...user , id: user.id.toString()}

  res.status(200).json(serializedUser)

  } catch (error) {
    // Handle any errors that occur
    
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
