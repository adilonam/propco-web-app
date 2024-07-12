import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, userId } = req.query;

  // Check that the id is a string
  if (typeof id !== 'string' || typeof userId !== "string") {
    res.status(400).json({ error: 'Invalid ID format.' });
    return;
  }


  const user =await prisma.user.findUnique({where:{id:BigInt(userId) }})

  if (!user || !user.admin) {
    res.status(403).json({ error: 'User not permitted' });
    return;
  }
  
  
  switch (req.method) {
    case 'GET':
      try {
       
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

           await prisma.user.update({
            where: { id: updatedClaimRequest.userId }, 
            data:{balance:0}
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
      

 

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
