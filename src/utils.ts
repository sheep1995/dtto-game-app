import { format } from 'date-fns-tz';
import { subDays } from 'date-fns';

export function getDateWithOffset(offset: number = 0, timezone: string = 'Asia/Taipei'): string {
    const date = subDays(new Date(), offset);
    const formattedDate = format(date, 'yyyy-MM-dd', { timeZone: timezone });
    return formattedDate;
}