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