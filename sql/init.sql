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
  rewardId VARCHAR(255) PRIMARY KEY,
  description TEXT NOT NULL,
  rewards JSON NULL
);

-- 創建 Tasks 表
CREATE TABLE Tasks (
  taskId INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('daily', 'weekly') NOT NULL,
  description TEXT NOT NULL,
  rewardId VARCHAR(255),
  requiredCount INT DEFAULT 1,
  mappingNumbers TEXT NOT NULL, -- 使用 TEXT 字段來存儲多個 mappingNumber
  operation TEXT NOT NULL,
  parentTaskId INT NULL,
  CONSTRAINT FK_Reward FOREIGN KEY (rewardId) REFERENCES Rewards(rewardId)
);

-- 創建 UserTasks 表
CREATE TABLE UserTasks (
  userId VARCHAR(255) NOT NULL,
  taskId INT NOT NULL,
  status ENUM('incomplete', 'complete') DEFAULT 'incomplete',
  currentCount INT DEFAULT 0,
  completedTime TIMESTAMP NULL,
  rewardClaimed BOOLEAN DEFAULT FALSE,
  taskDate DATE NOT NULL,
  PRIMARY KEY (userId, taskId),
  CONSTRAINT FK_User FOREIGN KEY (userId) REFERENCES Users(userId),
  CONSTRAINT FK_Task FOREIGN KEY (taskId) REFERENCES Tasks(taskId)
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


-- 插入最上层的父任务
INSERT INTO Tasks (type, description, rewardId, requiredCount, mappingNumbers, operation)
VALUES
('daily', '全部任務達成', 'reward_7', 5, '1,2,3,4,5,6,7', 'complete_all_tasks');

-- 获取插入的最上层父任务的 taskId
SET @topParentTaskId = LAST_INSERT_ID();

-- 插入父任务，模式游戏次数
INSERT INTO Tasks (type, description, rewardId, requiredCount, mappingNumbers, operation, parentTaskId)
VALUES
('daily', '各模式遊玩次数', 'reward_1', 5, '1,2,3,4,5,6,7', 'play_game', @topParentTaskId);

-- 获取插入的父任务的 taskId
SET @parentTaskId = LAST_INSERT_ID();

-- 插入各模式游戏次数的子任务
INSERT INTO Tasks (type, description, rewardId, requiredCount, mappingNumbers, operation, parentTaskId)
VALUES
('daily', '模式1遊玩次數', null, 1, '1,2,3,4,5,6,7', 'play_game_mode_1', @parentTaskId),
('daily', '模式2遊玩次數', null, 1, '1,2,3,4,5,6,7', 'play_game_mode_2', @parentTaskId),
('daily', '模式3遊玩次數', null, 1, '1,2,3,4,5,6,7', 'play_game_mode_3', @parentTaskId),
('daily', '模式4遊玩次數', null, 1, '1,2,3,4,5,6,7', 'play_game_mode_4', @parentTaskId),
('daily', '模式5遊玩次數', null, 1, '1,2,3,4,5,6,7', 'play_game_mode_4', @parentTaskId);

-- 插入合出特定角色次数的父任务
INSERT INTO Tasks (type, description, rewardId, requiredCount, mappingNumbers, operation, parentTaskId)
VALUES
('daily', '合出特定角色次数', 'reward_3', 6, '1,2,3,4,5,6,7', 'combine_character', @topParentTaskId);

-- 获取插入的合出特定角色次数父任务的 taskId
SET @characterParentTaskId = LAST_INSERT_ID();

-- 插入合出特定角色次数的子任务
INSERT INTO Tasks (type, description, rewardId, requiredCount, mappingNumbers, operation, parentTaskId)
VALUES
('daily', '合出特定角色次数 - Dinu', null, 10, '1,4', 'combine_character_dinu', @characterParentTaskId),
('daily', '合出特定角色次数 - Dinu', null, 20, '2,7', 'combine_character_dinu', @characterParentTaskId),
('daily', '合出特定角色次数 - Lynn', null, 10, '1,4', 'combine_character_lynn', @characterParentTaskId),
('daily', '合出特定角色次数 - Remi', null, 8, '3,5', 'combine_character_remi', @characterParentTaskId),
('daily', '合出特定角色次数 - Zolly', null, 4, '3,5', 'combine_character_zolly', @characterParentTaskId),
('daily', '合出特定角色次数 - Bob', null, 2, '3,5', 'combine_character_bob', @characterParentTaskId),
('daily', '合出特定角色次数 - 最大球', null, 1, '6', 'combine_character_dinu', @characterParentTaskId);

-- 插入特定模式中达到指定分数门槛的父任务
INSERT INTO Tasks (type, description, rewardId, requiredCount, mappingNumbers, operation, parentTaskId)
VALUES
('daily', '特定模式中达到指定分数门槛', 'reward_2', 1, '1,2,3,4,5,6,7', 'reach_score', @topParentTaskId);

-- 获取插入的特定模式中达到指定分数门槛父任务的 taskId
SET @scoreThresholdParentTaskId = LAST_INSERT_ID();

-- 插入特定模式中达到指定分数门槛的子任务
INSERT INTO Tasks (type, description, rewardId, requiredCount, mappingNumbers, operation, parentTaskId)
VALUES
('daily', '達到指定分數 - 模式1', null, 1200, '1,4', 'reach_score_mode_1', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式1', null, 1300, '2,7', 'reach_scored_mode_1', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式1', null, 1500, '3,5', 'reach_score_mode_1', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式1', null, 1800, '6', 'reach_score_mode_1', @scoreThresholdParentTaskId);

('daily', '達到指定分數 - 模式2', null, 1200, '1,4', 'reach_score_mode_2', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式2', null, 1300, '2,7', 'reach_scored_mode_2', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式2', null, 1500, '3,5', 'reach_score_mode_2', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式2', null, 1800, '6', 'reach_score_mode_2', @scoreThresholdParentTaskId);

('daily', '達到指定分數 - 模式3', null, 1200, '1,4', 'reach_score_mode_3', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式3', null, 1300, '2,7', 'reach_scored_mode_3', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式3', null, 1500, '3,5', 'reach_score_mode_3', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式3', null, 1800, '6', 'reach_score_mode_3', @scoreThresholdParentTaskId);

('daily', '達到指定分數 - 模式4', null, 1200, '1,4', 'reach_score_mode_4', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式4', null, 1300, '2,7', 'reach_scored_mode_4', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式4', null, 1500, '3,5', 'reach_score_mode_4', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式4', null, 1800, '6', 'reach_score_mode_4', @scoreThresholdParentTaskId);

('daily', '達到指定分數 - 模式5', null, 1200, '1,4', 'reach_score_mode_5', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式5', null, 1300, '2,7', 'reach_scored_mode_5', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式5', null, 1500, '3,5', 'reach_score_mode_5', @scoreThresholdParentTaskId),
('daily', '達到指定分數 - 模式5', null, 1800, '6', 'reach_score_mode_5', @scoreThresholdParentTaskId);

-- 插入其他任务
INSERT INTO Tasks (type, description, rewardId, requiredCount, mappingNumbers, operation, parentTaskId)
VALUES
('daily', '使用道具次数', 'reward_4', 2, '1,2,3,4,5,6,7', 'use_item', @topParentTaskId),
('daily', '看广告/轮命次数', 'reward_5', 2, '1,2,3,4,5,6,7', 'watch_ad', @topParentTaskId);


-- 插入獎勵
INSERT INTO Rewards (rewardId, description, rewards)
VALUES
('reward_1', '7反券', '{"type": "voucher", "amount": 7}'),
('reward_2', '7反券', '{"type": "voucher", "amount": 7}'),
('reward_3', '7反券', '{"type": "voucher", "amount": 7}'),
('reward_4', '1綠券', '{"type": "voucher", "amount": 1}'),
('reward_5', '1綠券', '{"type": "voucher", "amount": 1}'),
('reward_6', '9反券 1綠券', '{"type": "voucher", "amount": 9, "extra": {"type": "voucher", "amount": 1}}');
