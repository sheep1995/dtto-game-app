import { AppDataSource } from './config/data-source';
import { Commodities } from './entities/Commodities';
import { Items } from './entities/Items';
import { CommodityItems } from './entities/CommodityItems';
import { v4 as uuidv4 } from 'uuid';

async function insertData() {
  const commodityRepository = AppDataSource.getRepository(Commodities);
  const itemRepository = AppDataSource.getRepository(Items);
  const commodityItemsRepository = AppDataSource.getRepository(CommodityItems);

  const basicPack = commodityRepository.create({
    commodityId: uuidv4(),
    commodityName: 'Basic Pack',
    commodityDescription: 'A basic pack with some items',
    price: 4.99,
    currencyType: 'USD',
  });

  const advancedPack = commodityRepository.create({
    commodityId: uuidv4(),
    commodityName: 'Advanced Pack',
    commodityDescription: 'An advanced pack with more items',
    price: 9.99,
    currencyType: 'USD',
  });

  await commodityRepository.save([basicPack, advancedPack]);

  const fireball = itemRepository.create({
    itemId: uuidv4(),
    itemName: 'Fireball',
    itemType: 'challenge',
    itemAttributes: { itemSkill: 'Shoots fireball' },
    itemDescription: 'A powerful fireball',
  });

  const hat = itemRepository.create({
    itemId: uuidv4(),
    itemName: 'Hat',
    itemType: 'clothing',
    itemAttributes: { clothingPart: 'head' },
    itemDescription: 'A stylish hat',
  });

  const level1Egg = itemRepository.create({
    itemId: uuidv4(),
    itemName: 'Level 1 Egg',
    itemType: 'character_development',
    itemAttributes: { characterLevel: 1 },
    itemDescription: 'An egg that hatches into a level 1 character',
  });

  await itemRepository.save([fireball, hat, level1Egg]);

  const commodityItems = [
    commodityItemsRepository.create({
      commodityId: basicPack.commodityId,
      itemId: fireball.itemId,
      quantity: 10,
    }),
    commodityItemsRepository.create({
      commodityId: basicPack.commodityId,
      itemId: hat.itemId,
      quantity: 5,
    }),
    commodityItemsRepository.create({
      commodityId: advancedPack.commodityId,
      itemId: fireball.itemId,
      quantity: 20,
    }),
    commodityItemsRepository.create({
      commodityId: advancedPack.commodityId,
      itemId: level1Egg.itemId,
      quantity: 10,
    }),
  ];

  await commodityItemsRepository.save(commodityItems);
}

// 初始化數據源並插入數據
AppDataSource.initialize().then(() => {
  insertData().then(() => {
    console.log('Data inserted successfully.');
    process.exit(0);
  }).catch((error) => {
    console.error('Error inserting data:', error);
    process.exit(1);
  });
}).catch((error) => {
  console.error('Error initializing data source:', error);
  process.exit(1);
});
