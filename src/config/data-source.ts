import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Item } from '../entities/Item';
import { UserItem } from '../entities/UserItem';
import { CharacterLevel } from '../entities/CharacterLevel';
import { Commodities } from '../entities/Commodities';
import { Items } from '../entities/Items';
import { CommodityItems } from '../entities/CommodityItems';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [User, Item, UserItem, Commodities, CharacterLevel, Items, CommodityItems],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
