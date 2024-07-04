export function generateUserId(): string {
    return Math.random().toString(36).substring(2, 12); // 10-character random string
}