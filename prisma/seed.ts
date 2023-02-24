import { Item, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.braincell.create({
    data: users[0],
  });
  await prisma.braincell.create({
    data: users[1],
  });
}

const users = [
  {
    discordId: `189997816406474752`,
    hasBrainCell: true,
  },
  {
    discordId: `241416328966045697`,
    hasBrainCell: false,
  },
];

// const items: Item[] = [{}, {}, {}];

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
