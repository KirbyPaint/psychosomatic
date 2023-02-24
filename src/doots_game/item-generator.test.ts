import {
  Action,
  attributeGenerator,
  descriptionGenerator,
  Rarity,
  rarityGenerator,
  statCalculator,
  weaponGenerator,
  WeaponType,
  weaponTypeGenerator,
} from "./item-generator";

describe(`ItemGenerator`, () => {
  it(`should generate a description with attribute`, () => {
    const description = descriptionGenerator(
      WeaponType.Sword,
      Action.Attack,
      1,
      `Strong`,
    );
    expect(description).toBe(`Strong Sword of Attacking +1`);
  });
  it(`should generate a description with no attribute`, () => {
    const description = descriptionGenerator(
      WeaponType.Sword,
      Action.Attack,
      1,
    );
    expect(description).toBe(`Sword of Attacking +1`);
  });
  it(`should generate a random rarity`, () => {
    const rarity = rarityGenerator();
    expect(rarity).toBeTruthy();
    // can not automate this with Object.values() because it's const enum
    expect([
      Rarity.Common,
      Rarity.Uncommon,
      Rarity.Rare,
      Rarity.Epic,
      Rarity.Legendary,
    ]).toContain(rarity);
  });
  it(`should generate a stat based on rarity`, () => {
    let rarity = Rarity.Common;
    let stat = statCalculator(rarity);
    expect(stat).toBe(1);
    rarity = Rarity.Uncommon;
    stat = statCalculator(rarity);
    expect(stat).toBe(2);
    rarity = Rarity.Rare;
    stat = statCalculator(rarity);
    expect(stat).toBe(3);
    rarity = Rarity.Epic;
    stat = statCalculator(rarity);
    expect(stat).toBe(5);
    rarity = Rarity.Legendary;
    stat = statCalculator(rarity);
    expect(stat).toBe(8);
  });
  it(`should pull a random attribute from the local list`, () => {
    const attribute = attributeGenerator();
    expect(attribute).toBeTruthy();
  });
  it(`should generate a random weapon type`, () => {
    const type = weaponTypeGenerator();
    expect(type).toBeTruthy();
    expect([
      WeaponType.Sword,
      WeaponType.Axe,
      WeaponType.Mace,
      WeaponType.Bow,
      WeaponType.Staff,
      WeaponType.Dagger,
      WeaponType.Wand,
      WeaponType.Spear,
    ]).toContain(type);
  });
  it(`should generate multiple random weapon items`, () => {
    const items = weaponGenerator(10);
    console.log({ items });
    expect(items).toBeTruthy();
    expect(items.length).toBe(10);
  });
});
