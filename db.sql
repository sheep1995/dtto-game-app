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
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Items
CREATE TABLE Items (
    itemId CHAR(36) PRIMARY KEY,
    itemName VARCHAR(255) NOT NULL,
    itemType VARCHAR(255) NOT NULL,
    itemAttributes JSON,
    itemDescription TEXT,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: UserItems
CREATE TABLE UserItems (
    userId VARCHAR(255) NOT NULL,
    itemId CHAR(36) NOT NULL,
    quantity INTEGER NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, itemId),
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE,
    FOREIGN KEY (itemId) REFERENCES Items (itemId) ON DELETE CASCADE
);

-- Table: GameMode2000Score
CREATE TABLE GameMode2000Scores (
    roundId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    playTimeMs INTEGER NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
);

-- Table: GameModeLimitedTimeScore
CREATE TABLE GameModeLimitedTimeScore (
    roundId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    playTimeMs INTEGER NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
);

-- Table: GameModeNormalScore
CREATE TABLE GameModeNormalScore (
    roundId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    playTimeMs INTEGER NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users (userId) ON DELETE CASCADE
);

CREATE TABLE Transactions (
    transactionId VARCHAR(255) PRIMARY KEY, -- 主鍵，唯一標識交易
    userId VARCHAR(255) NOT NULL, -- 外鍵，參考 users 表的 userId
    itemId CHAR(36) NOT NULL, -- 外鍵，參考 Items 表的 itemId
    price DECIMAL(10, 2) NOT NULL, -- 交易金額
    status VARCHAR(255), -- 交易狀態，如成功、失敗
    purchaseToken VARCHAR(255), -- 交易令牌（如果適用）
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 記錄創建時間
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 記錄更新時間
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE, -- 外鍵
    FOREIGN KEY (itemId) REFERENCES Items(itemId) ON DELETE CASCADE -- 外鍵
);

CREATE TABLE IF NOT EXISTS Vouchers (
    voucherId VARCHAR(10) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    itemId CHAR(36) NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (itemId) REFERENCES Items(itemId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Compensations (
    compensationId VARCHAR(10) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    itemId CHAR(36) NOT NULL,
    quantity INT NOT NULL,
    staffId VARCHAR(255) NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (itemId) REFERENCES Items(itemId) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Admins (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO items (itemId, itemName, itemType, itemAttributes, itemDescription)
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

('voucher_1', 'voucher 1', 'voucher', '{"contents": [{"itemId": "character_egg_1", "quantity": 5}, {"itemId": "character_egg_2", "quantity": 1}], "price": 1500}', 'A starter pack with character eggs'),
('voucher_2', 'voucher 2', 'voucher', '{"contents": [{"itemId": "decoration_1", "quantity": 2}, {"itemId": "decoration_2", "quantity": 1}], "price": 2000}', 'An adventure pack with game items and a decoration'),
('voucher_3', 'voucher 3', 'voucher', '{"contents": [{"itemId": "game_item_1", "quantity": 3}, {"itemId": "game_item_2", "quantity": 2}], "price": 2500}', 'A battle pack essential for fighting enemies'),