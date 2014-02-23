export interface FriendMap {
    [name: string]: Friend;
}

export class Friend {
    index: number;
    name: string;
    id: number;
    links: number[];
}