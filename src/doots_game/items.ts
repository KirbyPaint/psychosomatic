import { Item, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// send as string because discord likes strings better than numbers
export async function countItems(): Promise<string> {
  const itemCount = await prisma.item.count();
  // console.log({ itemCount });
  return itemCount.toString();
}

export async function listItems(): Promise<string> {
  const items = await prisma.item.findMany();
  // Take list of items and turn it into a string list
  // where each row in the string is an item's description
  const itemsString = items.map((item) => {
    return item.description;
  }).join(`
`);
  return itemsString;
}
