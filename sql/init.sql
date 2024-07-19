-- CREATE USER 'sammy'@'%' IDENTIFIED BY 'sammy123';
-- GRANT ALL PRIVILEGES ON mydatabase2.* TO 'sammy'@'%';
-- FLUSH PRIVILEGES;

-- CREATE DATABASE IF NOT EXISTS mydatabase2;
-- USE mydatabase2;

-- Table: Users
CREATE TABLE Users (
    uId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL UNIQUE,
    token VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    loginType VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    coin INTEGER DEFAULT 0,
    characterLevel INTEGER DEFAULT 0,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -- Table: Items
CREATE TABLE Items (
    itemId CHAR(36) PRIMARY KEY,
    itemName VARCHAR(255) NOT NULL,
    itemType VARCHAR(255) NOT NULL,
    itemAttributes JSON,
    itemDescription TEXT,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -- Table: UserItems
CREATE TABLE UserItems (
    userId VARCHAR(255) NOT NULL,
    itemId CHAR(36) NOT NULL,
    quantity INTEGER NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, itemId),
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE,
    FOREIGN KEY (itemId) REFERENCES Items (itemId) ON DELETE CASCADE
);

-- -- Table: GameMode2000Score
CREATE TABLE GameMode2000Scores (
    roundId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    playTimeMs INTEGER NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
);

-- -- Table: GameModeLimitedTimeScore
CREATE TABLE GameModeLimitedTimeScore (
    roundId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    playTimeMs INTEGER NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
);

-- -- Table: GameModeNormalScore
CREATE TABLE GameModeNormalScore (
    roundId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    playTimeMs INTEGER NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
);

-- -- Table: Transactions
CREATE TABLE Transactions (
    transactionId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    itemId CHAR(36) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(255),
    purchaseToken VARCHAR(255),
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (itemId) REFERENCES Items(itemId) ON DELETE CASCADE
);

-- -- Table: Vouchers
CREATE TABLE Vouchers (
    voucherId VARCHAR(10) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    itemId CHAR(36) NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (itemId) REFERENCES Items(itemId) ON DELETE CASCADE
);

-- -- Table: Compensations
CREATE TABLE Compensations (
    compensationId VARCHAR(10) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    itemId CHAR(36) NOT NULL,
    quantity INT NOT NULL,
    staffId VARCHAR(255) NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (itemId) REFERENCES Items(itemId) ON DELETE CASCADE
);

-- -- Table: Admins
CREATE TABLE Admins (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -- Table: Sessions
CREATE TABLE Sessions (
    sessionId CHAR(36) PRIMARY KEY,
    userId CHAR(36) NOT NULL,
    loginTime TIMESTAMP NOT NULL,
    lastHeartbeat TIMESTAMP,
    logoutTime TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

-- -- Table: DailyMetrics
CREATE TABLE DailyMetrics (
    date DATE PRIMARY KEY,
    highestConcurrentUsers INT DEFAULT 0
);

-- 創建 Rewards 表
CREATE TABLE Rewards (
  rewardId VARCHAR(50) PRIMARY KEY,
  description TEXT NOT NULL,
  rewards JSON NULL
);

-- 創建 Tasks 表
CREATE TABLE Tasks (
  taskId VARCHAR(50) NOT NULL PRIMARY KEY,
  type ENUM('daily', 'weekly') NOT NULL,
  description TEXT NOT NULL,
  rewardId VARCHAR(50),
  requiredCount INT DEFAULT 1,
  schedule VARCHAR(30) NOT NULL, -- 使用 TEXT 字段來存儲多個 mappingNumber
  conditionCount INT NOT NULL,
  operation VARCHAR(50) NOT NULL,
  CONSTRAINT FK_Reward FOREIGN KEY (rewardId) REFERENCES Rewards(rewardId)
);

-- 创建 TaskConditions 表
CREATE TABLE TaskConditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskId VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    targetValue INT NOT NULL,
    extra JSON,
    FOREIGN KEY (taskId) REFERENCES Tasks(taskId) ON DELETE CASCADE
);

-- 創建 UserTasks 表
CREATE TABLE UserTasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    taskId VARCHAR(255) NOT NULL,
    taskConditionId INT NULL,
    currentCount INT DEFAULT 0,
    status ENUM('assigned', 'inprogress', 'complete') NOT NULL DEFAULT 'assigned',
    assignedDate TIMESTAMP NOT NULL,
    rewardClaimed BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_user
        FOREIGN KEY (userId)
        REFERENCES Users(userId)
        ON DELETE CASCADE,
    CONSTRAINT fk_task
        FOREIGN KEY (taskId)
        REFERENCES Tasks(taskId)
        ON DELETE CASCADE,
    CONSTRAINT fk_task_condition
        FOREIGN KEY (taskConditionId)
        REFERENCES TaskConditions(id)
        ON DELETE SET NULL
);

-- -- Insert into Items
INSERT INTO Items (itemId, itemName, itemType, itemAttributes, itemDescription)
VALUES
('commodity_currency_1', '500 Coins', 'commodity_currency', '{"coinAmount": 500, "price": 100}', 'Buy 500 coins for $100'),
('commodity_currency_2', '1500 Coins', 'commodity_currency', '{"coinAmount": 1500, "price": 250}', 'Buy 1500 coins for $250'),
('commodity_currency_3', '3000 Coins', 'commodity_currency', '{"coinAmount": 3000, "price": 450}', 'Buy 3000 coins for $450'),
('commodity_1', 'Starter Pack', 'commodity', '{"contents": [{"itemId": "character_egg_1", "quantity": 5}, {"itemId": "character_egg_2", "quantity": 1}], "price": 1500}', 'A starter pack with character eggs'),
('commodity_2', 'Adventure Pack', 'commodity', '{"contents": [{"itemId": "decoration_1", "quantity": 2}, {"itemId": "decoration_2", "quantity": 1}], "price": 2000}', 'An adventure pack with game items and a decoration'),
('commodity_3', 'Battle Pack', 'commodity', '{"contents": [{"itemId": "game_item_1", "quantity": 3}, {"itemId": "game_item_2", "quantity": 2}], "price": 2500}', 'A battle pack essential for fighting enemies'),
('game_item_1', 'Invisibility Cloak', 'game_item', '{"skill": "invisibility"}', 'Makes the player invisible for a short time'),
('game_item_2', 'Fire Sword', 'game_item', '{"skill": "fire"}', 'Engulfs enemies in flames upon contact'),
('game_item_3', 'Ice Wand', 'game_item', '{"skill": "freeze"}', 'Freezes enemies for five seconds'),
('decoration_1', 'Hipster Glasses', 'decoration', '{"part": "eyes"}', 'Stylish retro glasses to stand out in the crowd'),
('decoration_2', 'Warrior Helmet', 'decoration', '{"part": "head"}', 'A helmet that provides protection and style'),
('decoration_3', 'Magic Cape', 'decoration', '{"part": "back"}', 'A cape that billows mysteriously in the wind'),
('character_egg_1', 'Mystery Egg', 'character_egg', '{"contents": [{"itemId": "combine_item_1", "quantity": 3}, {"itemId": "combine_item_2", "quantity": 2}], "hatchTime": "24 hours"}', 'Hatch to find out what is inside!'),
('character_egg_2', 'Dragon Egg', 'character_egg', '{"contents": [{"itemId": "combine_item_1", "quantity": 1}, {"itemId": "combine_item_3", "quantity": 1}], "hatchTime": "48 hours"}', 'Hatch a dragon to aid in your quests'),
('character_egg_3', 'Fairy Egg', 'character_egg', '{"contents": [{"itemId": "combine_item_2", "quantity": 2}], "hatchTime": "12 hours"}', 'Discover a fairy companion from this egg'),
('combine_item_1', 'Magic Stone Level 1', 'combine_item', '{"level": 1, "requiredQuantity": 2}', 'Combine two to get a higher level stone'),
('combine_item_2', 'Magic Stone Level 2', 'combine_item', '{"level": 2, "requiredQuantity": 2}', 'Combine two to reach the next level'),
('combine_item_3', 'Magic Stone Level 3', 'combine_item', '{"level": 3, "requiredQuantity": 2}', 'Combine two to achieve the ultimate power stone');


-- 插入獎勵
INSERT INTO Rewards (rewardId, description, rewards)
VALUES
('reward_daily_1', '7灰券', '{"contents": [{"itemId": "game_item_1", "quantity": 7}]}'),
('reward_daily_2', '7灰券', '{"contents": [{"itemId": "game_item_1", "quantity": 7}]}'),
('reward_daily_3', '7灰券', '{"contents": [{"itemId": "game_item_1", "quantity": 7}]}'),
('reward_daily_4', '1綠券', '{"contents": [{"itemId": "game_item_2", "quantity": 1}]}'),
('reward_daily_5', '1綠券', '{"contents": [{"itemId": "game_item_2", "quantity": 1}]}'),
('reward_daily_all', '9灰券 1綠券', '{"contents": [{"itemId": "game_item_1", "quantity": 9}, {"itemId": "game_item_2", "quantity": 1}]}'),

('reward_weekly_1', '10灰券', '{"contents": [{"itemId": "game_item_1", "quantity": 10}]}'),
('reward_weekly_2', '20灰券', '{"contents": [{"itemId": "game_item_1", "quantity": 20}]}'),
('reward_weekly_3', '20灰券', '{"contents": [{"itemId": "game_item_1", "quantity": 20}]}'),
('reward_weekly_4', '1綠券', '{"contents": [{"itemId": "game_item_2", "quantity": 1}]}'),
('reward_weekly_5', '1綠券', '{"contents": [{"itemId": "game_item_2", "quantity": 1}]}'),
('reward_weekly_6', '2綠券', '{"contents": [{"itemId": "game_item_2", "quantity": 2}]}'),
('reward_weekly_all', '10灰券 2綠券', '{"contents": [{"itemId": "game_item_1", "quantity": 10}, {"itemId": "game_item_2", "quantity": 2}]}');


-- 插入每日任務
INSERT INTO Tasks (taskId, type, description, rewardId, schedule, conditionCount, operation) VALUES
('task_daily_1', 'daily', '各模式遊玩', 'reward_daily_1', '0,1,2,3,4,5,6', 5, 'play_count'),
('task_daily_2', 'daily', '隨機模式達指定分數', 'reward_daily_2', '1,4', 1, 'play_score'),
('task_daily_3', 'daily', '隨機模式達指定分數', 'reward_daily_2', '0,2', 1, 'play_score'),
('task_daily_4', 'daily', '隨機模式達指定分數', 'reward_daily_2', '3,5', 1, 'play_score'),
('task_daily_5', 'daily', '隨機模式達指定分數', 'reward_daily_2', '6', 1, 'play_score'),
('task_daily_6', 'daily', '合出特定角色', 'reward_daily_3', '1,4', 2, 'combine_character'),
('task_daily_7', 'daily', '合出特定角色', 'reward_daily_3', '0,2', 1, 'combine_character'),
('task_daily_8', 'daily', '合出特定角色', 'reward_daily_3', '3,5', 3, 'combine_character'),
('task_daily_9', 'daily', '合出特定角色', 'reward_daily_3', '6', 1, 'combine_character'),
('task_daily_10', 'daily', '使用道具', 'reward_daily_4', '0,1,2,3,4,5,6', 1, 'use_items'),
('task_daily_11', 'daily', '觀看廣告', 'reward_daily_5', '0,1,2,3,4,5,6', 1, 'ad_respawn'),
('task_daily_all', 'daily', '每日任務全部完成', 'reward_daily_all', '0,1,2,3,4,5,6', 0, 'complete_tasks');

-- 插入每周任務
INSERT INTO Tasks (taskId, type, description, rewardId, schedule, conditionCount, operation) VALUES
('task_weekly_1', 'weekly', '各模式遊玩', 'reward_weekly_1', '1,2,3,4', 5, 'play_count'),
('task_weekly_2', 'weekly', '隨機模式達指定分數', 'reward_weekly_2', '1', 1, 'play_score'),
('task_weekly_3', 'weekly', '隨機模式達指定分數', 'reward_weekly_2', '2', 1, 'play_score'),
('task_weekly_4', 'weekly', '隨機模式達指定分數', 'reward_weekly_2', '3', 1, 'play_score'),
('task_weekly_5', 'weekly', '隨機模式達指定分數', 'reward_weekly_2', '4', 1, 'play_score'),
('task_weekly_6', 'weekly', '合出特定角色', 'reward_weekly_3', '1', 6, 'combine_character'),
('task_weekly_7', 'weekly', '合出特定角色', 'reward_weekly_3', '2', 6, 'combine_character'),
('task_weekly_8', 'weekly', '合出特定角色', 'reward_weekly_3', '3', 6, 'combine_character'),
('task_weekly_9', 'weekly', '合出特定角色', 'reward_weekly_3', '4', 6, 'combine_character'),
('task_weekly_10', 'weekly', '使用道具', 'reward_weekly_4', '1,2,3,4', 1, 'use_items'),
('task_weekly_11', 'weekly', '觀看廣告', 'reward_weekly_5', '1,2,3,4', 1, 'ad_respawn'),
('task_weekly_12', 'weekly', '購買裝飾', 'reward_weekly_6', '1', 3, 'buy_decoration'),
('task_weekly_13', 'weekly', '購買裝飾', 'reward_weekly_6', '2', 3, 'buy_decoration'),
('task_weekly_14', 'weekly', '購買裝飾', 'reward_weekly_6', '3', 3, 'buy_decoration'),
('task_weekly_15', 'weekly', '購買裝飾', 'reward_weekly_6', '4', 3, 'buy_decoration'),
('task_weekly_all', 'weekly', '每周任務全部完成', 'reward_weekly_all', '1,2,3,4', 0, 'complete_tasks');

-- 插入每日任務條件
INSERT INTO TaskConditions (taskId, description, targetValue, extra) VALUES
('task_daily_1', '模式A遊玩1次', 1, '{"gameMode": "modeA"}'),
('task_daily_1', '模式B遊玩1次', 1, '{"gameMode": "modeB"}'),
('task_daily_1', '模式C遊玩1次', 1, '{"gameMode": "modeC"}'),
('task_daily_1', '模式D遊玩1次', 1, '{"gameMode": "modeD"}'),
('task_daily_1', '模式E遊玩1次', 1, '{"gameMode": "modeE"}'),

('task_daily_2', '模式A遊玩達1200分', 1200, '{"gameMode": "modeA"}'),
('task_daily_2', '模式B遊玩達1200分', 1200, '{"gameMode": "modeB"}'),
('task_daily_2', '模式C遊玩達1200分', 1200, '{"gameMode": "modeC"}'),
('task_daily_2', '模式D遊玩達1200分', 1200, '{"gameMode": "modeD"}'),
('task_daily_2', '模式E遊玩達1200分', 1200, '{"gameMode": "modeE"}'),

('task_daily_3', '模式A遊玩達1300分', 1300, '{"gameMode": "modeA"}'),
('task_daily_3', '模式B遊玩達1300分', 1300, '{"gameMode": "modeB"}'),
('task_daily_3', '模式C遊玩達1300分', 1300, '{"gameMode": "modeC"}'),
('task_daily_3', '模式D遊玩達1300分', 1300, '{"gameMode": "modeD"}'),
('task_daily_3', '模式E遊玩達1300分', 1300, '{"gameMode": "modeE"}'),

('task_daily_4', '模式A遊玩達1500分', 1500, '{"gameMode": "modeA"}'),
('task_daily_4', '模式B遊玩達1500分', 1500, '{"gameMode": "modeB"}'),
('task_daily_4', '模式C遊玩達1500分', 1500, '{"gameMode": "modeC"}'),
('task_daily_4', '模式D遊玩達1500分', 1500, '{"gameMode": "modeD"}'),
('task_daily_4', '模式E遊玩達1500分', 1500, '{"gameMode": "modeE"}'),

('task_daily_5', '模式A遊玩達1800分', 1800, '{"gameMode": "modeA"}'),
('task_daily_5', '模式B遊玩達1800分', 1800, '{"gameMode": "modeB"}'),
('task_daily_5', '模式C遊玩達1800分', 1800, '{"gameMode": "modeC"}'),
('task_daily_5', '模式D遊玩達1800分', 1800, '{"gameMode": "modeD"}'),
('task_daily_5', '模式E遊玩達1800分', 1800, '{"gameMode": "modeE"}'),

('task_daily_6', '合出Dinu', 10, '{"character": "Dinu"}'),
('task_daily_6', '合出Lynn', 10, '{"character": "Lynn"}'),

('task_daily_7', '合出Dinu', 20, '{"character": "Dinu"}'),

('task_daily_8', '合出Remi', 8, '{"character": "Remi"}'),
('task_daily_8', '合出Zolly', 4, '{"character": "Zolly"}'),
('task_daily_8', '合出Bob', 2, '{"character": "Bob"}'),

('task_daily_9', '合出最大球', 1, '{"character": "Biggest"}'),

('task_daily_10', '使用任意道具', 2, null),

('task_daily_11', '觀看續命廣告', 2, '{"adMode": "Respawn"}');


-- 插入每月任務條件
INSERT INTO TaskConditions (taskId, description, targetValue, extra) VALUES
('task_weekly_1', '模式A遊玩3次', 3, '{"gameMode": "modeA"}'),
('task_weekly_1', '模式B遊玩3次', 3, '{"gameMode": "modeB"}'),
('task_weekly_1', '模式C遊玩3次', 3, '{"gameMode": "modeC"}'),
('task_weekly_1', '模式D遊玩3次', 3, '{"gameMode": "modeD"}'),
('task_weekly_1', '模式E遊玩3次', 3, '{"gameMode": "modeE"}'),

('task_weekly_2', '模式A遊玩達2000分', 2000, '{"gameMode": "modeA"}'),
('task_weekly_2', '模式B遊玩達2000分', 2000, '{"gameMode": "modeB"}'),
('task_weekly_2', '模式C遊玩達2000分', 2000, '{"gameMode": "modeC"}'),
('task_weekly_2', '模式D遊玩達2000分', 2000, '{"gameMode": "modeD"}'),
('task_weekly_2', '模式E遊玩達2000分', 2000, '{"gameMode": "modeE"}'),

('task_weekly_3', '模式A遊玩達2200分', 2200, '{"gameMode": "modeA"}'),
('task_weekly_3', '模式B遊玩達2200分', 2200, '{"gameMode": "modeB"}'),
('task_weekly_3', '模式C遊玩達2200分', 2200, '{"gameMode": "modeC"}'),
('task_weekly_3', '模式D遊玩達2200分', 2200, '{"gameMode": "modeD"}'),
('task_weekly_3', '模式E遊玩達2200分', 2200, '{"gameMode": "modeE"}'),

('task_weekly_4', '模式A遊玩達2400分', 2400, '{"gameMode": "modeA"}'),
('task_weekly_4', '模式B遊玩達2400分', 2400, '{"gameMode": "modeB"}'),
('task_weekly_4', '模式C遊玩達2400分', 2400, '{"gameMode": "modeC"}'),
('task_weekly_4', '模式D遊玩達2400分', 2400, '{"gameMode": "modeD"}'),
('task_weekly_4', '模式E遊玩達2400分', 2400, '{"gameMode": "modeE"}'),

('task_weekly_5', '模式A遊玩達2500分', 2500, '{"gameMode": "modeA"}'),
('task_weekly_5', '模式B遊玩達2500分', 2500, '{"gameMode": "modeB"}'),
('task_weekly_5', '模式C遊玩達2500分', 2500, '{"gameMode": "modeC"}'),
('task_weekly_5', '模式D遊玩達2500分', 2500, '{"gameMode": "modeD"}'),
('task_weekly_5', '模式E遊玩達2500分', 2500, '{"gameMode": "modeE"}'),

('task_weekly_6', '合出Dinu', 50, '{"character": "Dinu"}'),
('task_weekly_6', '合出Lynn', 20, '{"character": "Lynn"}'),
('task_weekly_6', '合出Remi', 15, '{"character": "Remi"}'),
('task_weekly_6', '合出Zolly', 5, '{"character": "Zolly"}'),
('task_weekly_6', '合出Bob', 5, '{"character": "Bob"}'),
('task_weekly_6', '合出最大球', 4, '{"character": "Biggest"}'),

('task_weekly_7', '合出Dinu', 50, '{"character": "Dinu"}'),
('task_weekly_7', '合出Lynn', 20, '{"character": "Lynn"}'),
('task_weekly_7', '合出Remi', 15, '{"character": "Remi"}'),
('task_weekly_7', '合出Zolly', 5, '{"character": "Zolly"}'),
('task_weekly_7', '合出Bob', 5, '{"character": "Bob"}'),
('task_weekly_7', '合出最大球', 3, '{"character": "Biggest"}'),

('task_weekly_8', '合出Dinu', 80, '{"character": "Dinu"}'),
('task_weekly_8', '合出Lynn', 20, '{"character": "Lynn"}'),
('task_weekly_8', '合出Remi', 15, '{"character": "Remi"}'),
('task_weekly_8', '合出Zolly', 5, '{"character": "Zolly"}'),
('task_weekly_8', '合出Bob', 5, '{"character": "Bob"}'),
('task_weekly_8', '合出最大球', 4, '{"character": "Biggest"}'),

('task_weekly_9', '合出Dinu', 100, '{"character": "Dinu"}'),
('task_weekly_9', '合出Lynn', 20, '{"character": "Lynn"}'),
('task_weekly_9', '合出Remi', 15, '{"character": "Remi"}'),
('task_weekly_9', '合出Zolly', 5, '{"character": "Zolly"}'),
('task_weekly_9', '合出Bob', 5, '{"character": "Bob"}'),
('task_weekly_9', '合出最大球', 3, '{"character": "Biggest"}'),

('task_weekly_10', '使用任意道具', 5, null),

('task_weekly_11', '觀看續命廣告', 12, '{"adMode": "Respawn"}'),

('task_weekly_12', '購買頭飾', 2, '{"part": "Head"}'),
('task_weekly_12', '購買眼鏡', 1, '{"part": "Glasses"}'),
('task_weekly_12', '購買手持', 1, '{"part": "Hand"}'),

('task_weekly_13', '購買頭飾', 1, '{"part": "Head"}'),
('task_weekly_13', '購買眼鏡', 2, '{"part": "Glasses"}'),
('task_weekly_13', '購買手持', 1, '{"part": "Hand"}'),

('task_weekly_14', '購買頭飾', 1, '{"part": "Head"}'),
('task_weekly_14', '購買眼鏡', 1, '{"part": "Glasses"}'),
('task_weekly_14', '購買手持', 2, '{"part": "Hand"}'),

('task_weekly_15', '購買頭飾', 1, '{"part": "Head"}'),
('task_weekly_15', '購買眼鏡', 1, '{"part": "Glasses"}'),
('task_weekly_15', '購買手持', 1, '{"part": "Hand"}');