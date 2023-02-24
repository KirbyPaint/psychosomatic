import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function countItems() {
  return prisma.item.count();
}
