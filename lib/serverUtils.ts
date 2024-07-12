
import { prisma } from './prisma';

export async function createUserIfNotExists(userData: { id: bigint; firstname: string; lastname: string; username: string }) {
  const { id, firstname, lastname, username } = userData;

  // Check if the user already exists based on the id
  const existingUser = await prisma.user.findUnique({
    where: { id }
  });

  // If the user already exists, return the existing user and false indicating it was not created
  if (existingUser) {
    return { user: existingUser, created: false };
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

  // Return the newly created user and true indicating it was created
  return { user: newUser, created: true };
}



export async function invitationReward(sourceUserId: bigint, invitedUserId: bigint, reward: number) {

  try {
    const invitation = await prisma.invitation.create({
      data: { sourceUserId, invitedUserId, date: new Date() }
    })
    
    const sourceUser = await prisma.user.findUnique({
      where: { id: sourceUserId }, // Convert ID to BigInt
    });

    if (sourceUser) {
      const sourceUserUpated = await prisma.user.update({
        where: { id: sourceUserId },
        data: { balance: (reward + sourceUser.balance), invitedFriend: (1 + sourceUser.invitedFriend) }
      })
      console.log('User has reward ' + reward, sourceUserUpated);
      return sourceUserUpated
    }
    else {
      console.log('No user found for this invitation .');
    }

  } catch (error) {
    console.log('An error occurred while updating the reward balance');
  }
}
