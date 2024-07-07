// lib/userUtils.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUserIfNotExists(userData: { id: number; firstname: string; lastname: string; username: string; }) {
  const { id, firstname, lastname, username } = userData;

  // Check if the user already exists
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
      id, // Optional field, will be auto-generated if not provided
      firstname,
      lastname,
      username,
    },
  });

  return newUser;
}
