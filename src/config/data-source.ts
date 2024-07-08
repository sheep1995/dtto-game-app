import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Session } from '../entities/Session';
import { Item } from '../entities/Item';
import { UserItem } from '../entities/UserItem';
import { Transaction } from '../entities/Transaction';
import { Voucher } from '../entities/Voucher';
import { CharacterLevel } from '../entities/CharacterLevel';
import { GameMode2000Score } from '../entities/GameMode2000Score';
import { GameModeLimitedTimeScore } from '../entities/GameModeLimitedTimeScore';
import { GameModeNormalScore } from '../entities/GameModeNormalScore';

import { Admin } from '../entities/Admin';
import { Compensation } from '../entities/Compensation';
import { DailyMetrics } from '../entities/DailyMetrics';

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
  entities: [ 
    User,
    Session,
    Item,
    UserItem,
    Transaction,
    Voucher,
    GameMode2000Score,
    GameModeLimitedTimeScore,
    GameModeNormalScore,
    CharacterLevel,

    Admin,
    Compensation,
    DailyMetrics
  ],
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
