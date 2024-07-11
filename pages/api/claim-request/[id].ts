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
          res.status(200).json(claimRequest);
        } else {
          res.status(404).json({ error: 'Claim request not found.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch claim request.' });
      }
      break;

    case 'PUT':
      try {
        const { date, userId, email, cryptoAddress, phone } = req.body;
        // Update a claim request by ID
        const updatedClaimRequest = await prisma.claimRequest.update({
          where: { id },
          data: {
            date,
            userId,
            email,
            cryptoAddress,
            phone,
          },
        });

        res.status(200).json(updatedClaimRequest);
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

    case 'POST':
      try {
        // Create a new claim request
        const { date, userId, email, cryptoAddress, phone } = req.body;
        const newClaimRequest = await prisma.claimRequest.create({
          data: {
            date,
            userId,
            email,
            cryptoAddress,
            phone,
          },
        });

        res.status(201).json(newClaimRequest);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create claim request.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
