
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUserIfNotExists(userData: { id: bigint; firstname: string; lastname: string; username: string }) {
  const { id, firstname, lastname, username } = userData;

  // Check if the user already exists based on the id
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  // If the user already exists, return the existing user
  if (existingUser) {
    return existingUser;
  }

  // If the user does not exist, create a new user
  const newUser = await prisma.user.create({
    data: {
      id, // Must be provided as the Telegram ID (user ID)
      firstname,
      lastname,
      username,
    },
  });

  return newUser;
}
