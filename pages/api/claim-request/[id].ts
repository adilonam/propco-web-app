import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Check that the id is a string
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid ID format.' });
    return;
  }

  switch (req.method) {
    case 'GET':
      try {
        // Get a claim request by ID
        const claimRequest = await prisma.claimRequest.findUnique({
          where: { id },
        });

        if (claimRequest) {
          const serializedClaimRequest = { ...claimRequest, userId: claimRequest.userId.toString() };
          res.status(200).json(serializedClaimRequest);
        } else {
          res.status(404).json({ error: 'Claim request not found.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch claim request.' });
      }
      break;

      case 'PUT':
        try {
          const { approve } = req.body;
          
          // Update only the approve field of a claim request by ID
          const updatedClaimRequest = await prisma.claimRequest.update({
            where: { id },
            data: { approve },
          });
      
          const serializedUpdatedClaimRequest = {
            ...updatedClaimRequest,
            userId: updatedClaimRequest.userId.toString(),
          };
      
          res.status(200).json(serializedUpdatedClaimRequest);
        } catch (error) {
          res.status(500).json({ error: 'Failed to update claim request.' });
        }
        break;
      

    case 'DELETE':
      try {
        // Delete a claim request by ID
        await prisma.claimRequest.delete({
          where: { id },
        });

        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete claim request.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
