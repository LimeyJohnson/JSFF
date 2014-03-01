import F = require("friend");

export class FriendStats {
    static friendCount: number;
    static linkCount: number;
    static GetFriendStats(friendMap: F.FriendMap) {
        FriendStats.friendCount = 0;
        FriendStats.linkCount = 0;
        for (var key in friendMap) {
            FriendStats.friendCount++;
            FriendStats.linkCount += friendMap[key].links.length;
        }
    }
} 