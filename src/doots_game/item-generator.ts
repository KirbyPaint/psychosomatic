import { Item } from "@prisma/client";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";
import { getRandomArbitrary } from "../consts";

export const enum Action {
  Attack = `Attack`,
  Defend = `Defend`,
}

export const enum Rarity {
  Common = `Common`,
  Uncommon = `Uncommon`,
  Rare = `Rare`,
  Epic = `Epic`,
  Legendary = `Legendary`,
}

export const enum WeaponType {
  Sword = `Sword`,
  Axe = `Axe`,
  Mace = `Mace`,
  Bow = `Bow`,
  Staff = `Staff`,
  Dagger = `Dagger`,
  Wand = `Wand`,
  Spear = `Spear`,
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function descriptionGenerator(
  type: WeaponType,
  action: Action,
  stat: number,
  attribute?: string,
): string {
  return `${attribute ? capitalizeFirstLetter(attribute) : ``}${
    attribute ? ` ` : ``
  }${type} of ${action}ing +${stat}`;
}

export function rarityGenerator(): Rarity {
  const rarity = Math.random();
  switch (true) {
    case rarity < 0.7:
      return Rarity.Common;
    case rarity < 0.85:
      return Rarity.Uncommon;
    case rarity < 0.95:
      return Rarity.Rare;
    case rarity < 0.99:
      return Rarity.Epic;
    default:
      return Rarity.Legendary;
  }
}

export function statCalculator(rarity: Rarity): number {
  switch (rarity) {
    case Rarity.Common:
      return 1;
    case Rarity.Uncommon:
      return 2;
    case Rarity.Rare:
      return 3;
    case Rarity.Epic:
      return 5;
    case Rarity.Legendary:
      return 8;
  }
}

export function attributeGenerator(): string {
  const attributeDirectory = path.join(
    process.cwd(),
    `src`,
    `doots_game`,
    `resources`,
    `adjectives.txt`,
  );
  const attributeArray = fs
    .readFileSync(attributeDirectory)
    .toString()
    .split(`\n`);
  const show =
    attributeArray[Math.floor(getRandomArbitrary(0, attributeArray.length))];
  return show;
}

export function weaponTypeGenerator(): WeaponType {
  const weaponType = Math.random();
  switch (true) {
    case weaponType < 0.1:
      return WeaponType.Sword;
    case weaponType < 0.2:
      return WeaponType.Axe;
    case weaponType < 0.3:
      return WeaponType.Mace;
    case weaponType < 0.4:
      return WeaponType.Bow;
    case weaponType < 0.5:
      return WeaponType.Staff;
    case weaponType < 0.6:
      return WeaponType.Dagger;
    case weaponType < 0.7:
      return WeaponType.Wand;
    case weaponType < 0.8:
      return WeaponType.Spear;
    default:
      return WeaponType.Sword;
  }
}

export function weaponGenerator(quantity: number): Item[] {
  const weapons: Item[] = [];
  for (let i = 0; i < quantity; i++) {
    const type = weaponTypeGenerator();
    const rarity = rarityGenerator();
    const stat = statCalculator(rarity);
    const hasAttribute = Math.random() > 0.5;
    let attribute = ``;
    if (hasAttribute) {
      attribute = attributeGenerator();
    }
    const description = descriptionGenerator(
      type,
      Action.Attack,
      stat,
      attribute,
    );
    const weapon = {
      id: v4(),
      createdAt: new Date(),
      updatedAt: null,
      action: Action.Attack,
      attribute,
      description,
      rarity,
      stat,
      type,
      ownerId: null,
    };
    weapons.push(weapon);
  }
  return weapons;
}
