export interface Score {
    id?: number; // 分数记录的唯一标识，可选，因为插入时会自动生成
    userId: string; // 玩家ID
    score: number; // 分数
    playTimeMs?: number; 
}