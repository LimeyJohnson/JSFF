define(["require", "exports"], function(require, exports) {
    var FriendStats = (function () {
        function FriendStats() {
        }
        FriendStats.GetFriendStats = function (friendMap) {
            FriendStats.friendCount = 0;
            FriendStats.linkCount = 0;
            for (var key in friendMap) {
                FriendStats.friendCount++;
                FriendStats.linkCount += friendMap[key].links.length;
            }
        };
        return FriendStats;
    })();
    exports.FriendStats = FriendStats;
});
