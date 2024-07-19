export function getWeekInCycle(today: Date, startDate: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysInCycle = 28; // 每個循環有28天

    // 計算兩個日期之間的差異天數
    const dayCount = Math.floor((today.getTime() - startDate.getTime()) / msPerDay);

    // 計算當前是循環中的第幾周
    const weekInCycle = Math.floor((dayCount % daysInCycle) / 7) + 1;

    return weekInCycle;
}