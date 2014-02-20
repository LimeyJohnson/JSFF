using System;
using jQueryApi;
using FreindsLibrary;
using D3Api;
using System.Collections;
namespace JSFFScript
{
    public class FQLQuery: IQueryEngine
    {
        public IDeferred<Dictionary> RunQuery(Dictionary friends)
        {
            jQueryDeferred<Dictionary> returnPromise = jQuery.DeferredData<Dictionary>(); 
            Queries q = new Queries();
            q.friendsAll = "SELECT uid1, uid2 from friend WHERE uid1 = me()";
            q.friendsoffriends = "SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsAll) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2";

            ApiOptions queryOptions = new ApiOptions();
            queryOptions.method = "fql.multiquery";
            queryOptions.queries = q;


            Facebook.api(queryOptions, delegate(QueryResponse[] queryResponse)
            {
                if (!Script.Boolean(queryResponse[0]))
                {
                    returnPromise.Reject();
                }
                else
                {
                    for (int i = 0; i < queryResponse[1].fql_result_set.Length; i++)
                    {
                        MultiQueryResults results = queryResponse[1].fql_result_set[i];
                        Friend target = ((Friend)friends[results.uid1]);
                        Friend origin = ((Friend)friends[results.uid2]);
                        origin.links.Add(target.id);
                        target.links.Add(origin.id);
                    }
                    returnPromise.RejectWith(friends);
                }

            });
            return returnPromise.Promise();
        }
    }
}
