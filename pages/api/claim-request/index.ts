import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const {  userId } = req.query;
        if (typeof userId !== "string") {
          res.status(400).json({ error: 'Invalid ID format.' });
          return;
        }
        const user =await prisma.user.findUnique({where:{id:BigInt(userId) }})

        if (!user || !user.admin) {
          res.status(403).json({ error: 'User not permitted' });
          return;
        }

        // Get all claim requests and include user details
        const claimRequests = await prisma.claimRequest.findMany({
          distinct: ['userId'],
          orderBy: {
            date: 'desc',  // Order by date descending to get the most recent date
          },
          include: {
            user: true, // Include the related user details
          },
        });

        // Serialize claim requests
        const serializedClaimRequests = claimRequests.map(request => ({
          ...request,
          userId: request.userId.toString(),
          user: {
            ...request.user,
            id: request.user.id.toString(), // Convert BigInt to string
          },
        }));

        res.status(200).json(serializedClaimRequests);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch claim requests.' });
      }
      break;


    case 'POST':
      try {
        // Create a new claim request
        const { userId, email, cryptoAddress, phone } = req.body;
        const newClaimRequest = await prisma.claimRequest.create({
          data: {
            date: new Date(),
            userId,
            email,
            cryptoAddress,
            phone,
          },
        });

        // Serialize new claim request
        const serializedNewClaimRequest = {
          ...newClaimRequest,
          userId: newClaimRequest.userId.toString(),
        };

        res.status(201).json(serializedNewClaimRequest);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create claim request.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
