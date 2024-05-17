const Redis = require('ioredis');
const client = new Redis();

// 添加或更新玩家分數
function addOrUpdateScore() {
    const gameModes = ['Normal', 'LimitedTime', '2000'];
    const randomGameMode = gameModes[Math.floor(Math.random() * gameModes.length)];

    const today = new Date();
    const randomDate = new Date(today.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    const formattedDate = randomDate.toISOString().slice(0, 10); // Format as yyyy-MM-dd

    const playerId = 'user' + Math.floor(1 + Math.random() * 9999).toString().padStart(4, '0');
    const score = Math.floor(1 + Math.random() * 10000);

    return [
        client.zadd(`Scores_${randomGameMode}_${formattedDate}`, 'GT', score, playerId),
        client.zadd(`Scores_${randomGameMode}`, 'GT', score, playerId)
    ];
}

// 添加 100 萬筆隨機資料
async function addMillionScores() {
    const batchSize = 1000;
    const totalScores = 1000000;

    for (let i = 0; i < totalScores; i += batchSize) {
        const promises = [];
        for (let j = 0; j < batchSize; j++) {
            promises.concat(...promises, addOrUpdateScore());
        }
        await Promise.all(promises);
    }

    console.log('Successfully added 1000000 random scores to the leaderboard.');
}

// 查詢玩家排名
async function getPlayerRank(playerId) {
    const rank = await client.zrevrank('leaderboard', playerId);
    return rank !== null ? rank + 1 : null;
}

// 查詢排行榜（當日/當周/全部）
async function getLeaderboard(type = 'all') {
    let start = 0, end = -1;
    const now = new Date();

    if (type === 'today') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        start = yesterday.getTime();
    } else if (type === 'week') {
        const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        start = firstDayOfWeek.getTime();
    }

    // 根据 type 设置查询范围
    let minScore = '-inf';
    if (type === 'today' || type === 'week') {
        minScore = `(${start}`; // 使用 '(' 表示不包括 start 分数本身
    }

    // 查询有序集合，根据 type 过滤分数范围
    const leaderboard = await client.zrevrangebyscore('leaderboard', '+inf', minScore, 'WITHSCORES');
    const filteredLeaderboard = [];

    for (let i = 0; i < leaderboard.length; i += 2) {
        const playerId = leaderboard[i];
        const score = parseFloat(leaderboard[i + 1]);
        filteredLeaderboard.push({ playerId, score });
    }

    return filteredLeaderboard;
}

// 清空排行榜
function clearLeaderboard(key) {
    client.del(key);
}

// 使用範例
async function example() {
    //await client.zadd('leaderboard1', 100, 'player1');
    await addMillionScores();

    // const player1Rank = await getPlayerRank('user167');
    // console.log('user167:', player1Rank);

    // const todayLeaderboard = await getLeaderboard('today');
    // console.log('Today leaderboard:', todayLeaderboard);

    //clearLeaderboard('leaderboard1');
}

example();

//ZUNIONSTORE out 7 leaderboard1 leaderboard2 leaderboard3 leaderboard4 leaderboard5 leaderboard6 leaderboard7 AGGREGATE MAX