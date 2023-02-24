import { Item, PrismaClient } from "@prisma/client";
import { weaponGenerator } from "../src/doots_game/item-generator";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  if ((await prisma.braincell.count()) === 0) {
    await prisma.braincell.create({
      data: users[0],
    });
    await prisma.braincell.create({
      data: users[1],
    });
  }
  if ((await prisma.item.count()) === 0) {
    const items = weaponGenerator(10);
    // createMany not supported for sqlite
    for (const item of items) {
      await prisma.item.create({
        data: item,
      });
    }
  }
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
