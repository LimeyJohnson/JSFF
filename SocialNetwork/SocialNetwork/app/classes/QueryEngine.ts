/// <reference path="../../scripts/typings/facebook/facebook.d.ts" />
import F = require("friend");
export class IQueryEngine {
    FB: IFacebook;
    constructor(facebook: IFacebook) {
        this.FB = facebook;
    }
    RunQuery(friends: F.FriendMap): JQueryPromise<F.FriendMap> {
        return null;
    }
}

export class BatchQuery extends IQueryEngine {
    requestCount: number;
    responseCount: number;
    friends: F.FriendMap;
    batchesComplete: JQueryDeferred<F.FriendMap>;
    RunQuery(friends: F.FriendMap): JQueryPromise<F.FriendMap> {
        this.requestCount = this.responseCount = 0;
        this.friends = friends;
        var friendBatches = BatchQuery.spitFriendsList(friends);
        for (var x = 0; x < friendBatches.length; x++) {
            var batchFriends = friendBatches[x];
            var batch = new Array(50);
            for (var y = 0; y < batchFriends.length; y++) {
                var d = { method: 'GET', relative_url: 'me/mutualfriends/' + batchFriends[x].id };
                batch[y] = d;
            }
            FB.api('/', 'POST', { batch: batch, include_headers: false }, this.facebookApiCallBack);
            this.requestCount++;
        }
        return this.batchesComplete.promise();
    }
    facebookApiCallBack(response?: any) {
        this.responseCount++;
        var element = $.parseJSON(response[0].body.toString());
        if (this.responseCount == this.requestCount) {
            window.alert('alldone');
        }
    }
    static spitFriendsList = function (list: F.FriendMap) {
        var splicecount = 50;
        var friendsList = [];
        var currArray = [];
        var counter = 0;
        $.each(list, function (name, value) {
            if (counter >= splicecount) {
                friendsList.push(currArray);
                currArray = [];
                counter = 0;
            }
            currArray[counter] = value;
            counter++;
        });
        friendsList.push(currArray);
        return friendsList;
    };
}

export class FQLQuery extends IQueryEngine {
    RunQuery(friends: F.FriendMap): JQueryPromise<F.FriendMap> {
        var returnPromise = $.Deferred();
        FB.api({
            method: 'fql.multiquery',
            queries:
            {
                friendsAll: 'SELECT uid1, uid2 from friend WHERE uid1 = me()',
                friendsoffriends: 'SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsAll) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2'
            }

        }, (queryResponse?: any) => {
                if (!!!queryResponse[0]) {
                    returnPromise.reject();
                }
                else {
                    for (var i = 0; i < queryResponse[1].fql_result_set.length; i++) {
                        var results = queryResponse[1].fql_result_set[i];
                        var target = (friends[results.uid1]);
                        var origin = (friends[results.uid2]);
                        origin.links.push(target.id);
                        target.links.push(origin.id);
                    }
                    returnPromise.rejectWith(friends);
                }
            });
        return returnPromise.promise();
    }
}