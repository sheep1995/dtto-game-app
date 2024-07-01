CREATE TABLE Users (
    uId VARCHAR(255) PRIMARY KEY,
    userId VARCHAR(10) NOT NULL UNIQUE,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    loginType INT CHECK (loginType BETWEEN 1 AND 20),
    token VARCHAR(255)
);

CREATE TABLE Scores_Normal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(10) NOT NULL,
    score INT NOT NULL,
    playTimeMs INT NOT NULL,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Scores_LimitedTime (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(10) NOT NULL,
    score INT NOT NULL,
    playTimeMs INT NOT NULL,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE UserItems (
    userId VARCHAR(10),
    itemId VARCHAR(25),
    quantity INT NOT NULL,
    updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, itemId ),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE Purchases (
    transactionId VARCHAR(100) PRIMARY KEY,
    userId VARCHAR(10),
    commodityId VARCHAR(99),
    quantity INT,
    price INT,
    status VARCHAR(50),
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

/*
增加隨機分數紀錄
*/
INSERT INTO Scores_Normal (userId, score, playTimeMs, createTime)
SELECT 
    CONCAT('user', LPAD(FLOOR(1 + RAND() * 999), 3, '0')),
    FLOOR(1 + RAND() * 10000),
    FLOOR(1000 + RAND() * 999000),
    NOW() - INTERVAL FLOOR(1 + RAND() * 30) DAY - INTERVAL FLOOR(1 + RAND() * 24) HOUR - INTERVAL FLOOR(1 + RAND() * 60) MINUTE - INTERVAL FLOOR(1 + RAND() * 60) SECOND
FROM 
    information_schema.tables t1,
    information_schema.tables t2
LIMIT 100000;

/*
查找分數排名
*/
SELECT 
    userId,
    player_rank
FROM (
    SELECT 
        userId,
        @row_number:=CASE
            WHEN @current_user = userId THEN @row_number
            ELSE 1
        END AS player_rank,
        @current_user:=userId
    FROM (
        SELECT 
            userId,
            score,
            @row_number:=IF(@current_user=userId, @row_number+1, 1) AS player_rank,
            @current_user:=userId
        FROM 
            Scores_Normal
        ORDER BY 
            userId, score DESC
    ) AS ranked_scores
) AS ranked_players;


/*
*/
SELECT 
    userId,
    FIND_IN_SET(score, (SELECT GROUP_CONCAT(score ORDER BY score DESC) FROM Scores_Normal WHERE createTime >= NOW() - INTERVAL 7 DAY)) AS player_rank
FROM 
    Scores_Normal 
WHERE 
    userId = 'user423' AND createTime >= NOW() - INTERVAL 7 DAY;

/*
取得排名榜
*/
SELECT 
    id,
    userId,
    best_score,
    createTime,
    ROW_NUMBER() OVER (ORDER BY best_score DESC) AS player_rank
FROM (
    SELECT 
        id,
        userId,
        createTime,
        MAX(score) AS best_score
    FROM 
        Scores_Normal
    WHERE 
        createTime >= NOW() - INTERVAL 1.5 DAY
    GROUP BY 
        userId
) AS max_scores;


SELECT 
    A.userId,
    A.score AS best_score,
    A.createTime
FROM(
SELECT 
    userId,
    score,
    ROW_NUMBER() OVER (ORDER BY MAX(score) DESC) AS player_rank,
    createTime
FROM Scores_Normal
) A;
WHERE A.player_rank = 1;


/*
取得個人排名
*/
SELECT 
    player_rank
FROM (
    SELECT 
        userId,
        ROW_NUMBER() OVER (ORDER BY MAX(score) DESC) AS player_rank
    FROM 
        Scores_Normal
    WHERE 
        createTime >= NOW() - INTERVAL 7 DAY
    GROUP BY 
        userId
) AS ranked_players
WHERE 
    userId = 'user423';




/*
*/
INSERT INTO Scores_Normal (userId, score, playTimeMs, createTime)
VALUES ('user423', 500, 100000, NOW() );

/*
*/
SELECT a.id, a.userId, a.score, a.createTime, ROW_NUMBER() OVER (ORDER BY b.max_score DESC) AS player_rank
FROM Scores_Normal a
INNER JOIN (
    SELECT userId, MAX(score) AS max_score, createTime
    FROM Scores_Normal
    WHERE createTime >= NOW() - INTERVAL 7 DAY
    GROUP BY userId
) b ON a.userId = b.userId AND a.score = b.max_score
LIMIT 
    100;


CREATE INDEX index_userId ON Scores_Normal (userId);
CREATE INDEX index_createTime ON Scores_Normal (createTime);
DROP INDEX index_userId ON Scores_Normal;


/*06/25*/
INSERT INTO Items (itemId, itemName, itemType, itemAttributes, itemDescription)
VALUES (
  'combine1', 
  'combineItem1', 
  'CombineItem', 
  '{"level": 1}', 
  'A combine item of level 1'
),
(
  'combine2', 
  'combineItem2', 
  'CombineItem', 
  '{"level": 2}', 
  'A combine item of level 2'
),
(
  'combine3', 
  'combineItem3', 
  'CombineItem', 
  '{"level": 3}', 
  'A combine item of level 3'
),
(
  'combine4', 
  'combineItem4', 
  'CombineItem', 
  '{"level": 4}', 
  'A combine item of level 4'
),
(
  'combine5', 
  'combineItem5', 
  'CombineItem', 
  '{"level": 5}', 
  'A combine item of level 5'
)
,(
  'egg1', 
  'Character Egg 1', 
  'CharacterEgg', 
  '{"items": [{"itemId": "combine1", "quantity": 10}, {"itemId": "combine2", "quantity": 5}]}', 
  'A special egg that hatches into multiple combine items'
);



INSERT INTO items (itemId, itemName, itemType, itemAttributes, itemDescription)
VALUES
('commodity_currency_1', '500 Coins', 'commodity_currency', '{"coinAmount": 500, "price": 100}', 'Buy 500 coins for $100'),
('commodity_currency_2', '1500 Coins', 'commodity_currency', '{"coinAmount": 1500, "price": 250}', 'Buy 1500 coins for $250'),
('commodity_currency_3', '3000 Coins', 'commodity_currency', '{"coinAmount": 3000, "price": 450}', 'Buy 3000 coins for $450'),

('commodity_1', 'Starter Pack', 'commodity', '{"contents": [{"itemId": "character_egg_1", "quantity": 5}, {"itemId": "character_egg_2", "quantity": 1}], "priceInCoins": 1500}', 'A starter pack with character eggs'),
('commodity_2', 'Adventure Pack', 'commodity', '{"contents": [{"itemId": "decoration_1", "quantity": 2}, {"itemId": "decoration_2", "quantity": 1}], "priceInCoins": 2000}', 'An adventure pack with game items and a decoration'),
('commodity_3', 'Battle Pack', 'commodity', '{"contents": [{"itemId": "game_item_1", "quantity": 3}, {"itemId": "game_item_2", "quantity": 2}], "priceInCoins": 2500}', 'A battle pack essential for fighting enemies'),

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