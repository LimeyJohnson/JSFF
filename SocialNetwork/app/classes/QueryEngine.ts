/// <reference path="../../scripts/typings/facebook/facebook.d.ts" />
import F = require("friend");
export class IQueryEngine {
    RunQuery(friends: F.FriendMap, fb:IFacebook): JQueryPromise<F.FriendMap> {
        return null;
    }
}

export class BatchQuery extends IQueryEngine {
    static requestCount: number;
    static responseCount: number;
    static friends: F.FriendMap;
    static batchesComplete: JQueryDeferred<F.FriendMap>;
    RunQuery(friends: F.FriendMap, FB: IFacebook): JQueryPromise<F.FriendMap> {
        BatchQuery.batchesComplete = $.Deferred();
        BatchQuery.requestCount = BatchQuery.responseCount = 0;
        BatchQuery.friends = friends;
        var friendBatches = BatchQuery.spitFriendsList(friends);
        for (var x = 0; x < friendBatches.length; x++) {
            var batchFriends = friendBatches[x];
            var batch = new Array(50);
            for (var y = 0; y < batchFriends.length; y++) {
                var d = { method: 'GET', relative_url: 'me/mutualfriends/' + batchFriends[x].id };
                batch[y] = d;
            }
            FB.api('/', 'POST', { batch: batch }, this.facebookApiCallBack);
            BatchQuery.requestCount++;
        }
        return BatchQuery.batchesComplete.promise();
    }
    facebookApiCallBack(response?: any) {
        BatchQuery.responseCount++;
        if (!!!response.error) {
            for(var x:number = 0; x < response.length; x++)
            {
                var element: IFaceBookMutualFriends = <IFaceBookMutualFriends> $.parseJSON(response[0].body.toString());
                var fbid: string = BatchQuery.GetFriendIDFromPagingURL(element.paging.next);
                for (var y: number = 0; y < element.data.length; y++) {
                    BatchQuery.friends[fbid].links.push(element.data[y].id);
                }
            }
        }
        if (BatchQuery.responseCount == BatchQuery.requestCount) {
            BatchQuery.batchesComplete.resolve(BatchQuery.friends);
        }
    }
    static GetFriendIDFromPagingURL(URL:string):string {
        var re = /user=(\d+)&/;
        return re.exec(URL)[0].replace("user=","").replace("&","");
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
    RunQuery(friends: F.FriendMap, FB: IFacebook): JQueryPromise<F.FriendMap> {
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
                    returnPromise.reject();
                    //returnPromise.resolve(friends);
                }
            });
        return returnPromise.promise();
    }
}