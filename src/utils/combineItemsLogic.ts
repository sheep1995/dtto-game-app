export type ItemType = {
    level: number;
    quantity: number;
};

export function combineItemsLogic(items: ItemType[]): ItemType[] {
    let levelMap = new Map<number, number>();

    // Initialize the level map and find the maximum level
    let maxLevel = 0;
    items.forEach(item => {
        let level = item.level;
        if (!levelMap.has(level)) {
            levelMap.set(level, 0);
        }
        levelMap.set(level, levelMap.get(level)! + item.quantity);
        if (level > maxLevel) {
            maxLevel = level;
        }
    });

    // Combine logic: Perform binary carry
    let carry = 0;
    let newLevelMap = new Map<number, number>();

    for (let level = 1; level <= maxLevel; level++) {
        let count = levelMap.get(level) || 0;
        let total = count + carry;
        newLevelMap.set(level, total & 1); // Compute current bit value
        carry = total >> 1; // Compute carry
    }

    // If there is remaining carry, continue processing
    let nextLevel = maxLevel + 1;
    while (carry > 0) {
        newLevelMap.set(nextLevel, carry & 1);
        carry = carry >> 1;
        nextLevel++;
    }

    // Convert the result to an array and return
    let result: ItemType[] = [];
    newLevelMap.forEach((quantity, level) => {
        if (quantity > 0) {
            result.push({ level, quantity });
        }
    });

    return result;
}