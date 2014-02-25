export interface FriendMap {
    [name: string]: Friend;
}

export class Friend {
    constructor() {
        this.links = [];
        this.name = "unknown";
    }
    index: number;
    name: string;
    id: string;
    links: string[];
}