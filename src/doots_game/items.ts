import { Item, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// send as string because discord likes strings better than numbers
export async function countItems(): Promise<string> {
  const itemCount = await prisma.item.count();
  return itemCount.toString();
}

export async function listItems(): Promise<string> {
  const items = await prisma.item.findMany({
    where: {
      Owner: {
        is: null,
      },
    },
  });
  // Take list of items and turn it into a string list
  // where each row in the string is an item's description
  const itemsString = items.map((item) => {
    return item.description;
  }).join(`
`);
  return `\`\`\`${itemsString}\`\`\``;
}

export async function listMyItems(discordId: string): Promise<string> {
  const items = await prisma.item.findMany({
    where: {
      Owner: {
        discordId,
      },
    },
  });
  if (items.length === 0) {
    return `You have no items!`;
  }
  const itemsString = items.map((item) => {
    return item.description;
  }).join(`
`);
  return `\`\`\`${itemsString}\`\`\``;
}

export async function getRandomItem(discordId: string): Promise<string> {
  // database finds a random item without an owner
  const randomItem = await prisma.item.findFirst({
    where: {
      Owner: {
        is: null,
      },
    },
  });
  if (!randomItem) {
    return `No more items!`;
  }
  // verify that the current person is a player in the game
  const player = await prisma.player.findFirst({
    where: {
      discordId,
    },
  });
  if (!player) {
    return `You're not playing!`;
  }
  // connect the item to the user who requested it
  const connectedItem = await prisma.item.update({
    where: {
      id: randomItem.id,
    },
    data: {
      Owner: {
        connect: {
          discordId,
        },
      },
    },
  });
  if (!connectedItem) {
    return `Error connecting item to user`;
  }
  return `You found: ${connectedItem.description}`;
}
