using System;
using jQueryApi;
using System.Collections;
using FreindsLibrary;
namespace JSFFScript
{
    public class BatchQuery : IQueryEngine
    {
        int RequestCount;
        int ResponseCount;
        Dictionary Friends = new Dictionary();
        jQueryDeferred<Dictionary> batchesComplete = jQuery.DeferredData<Dictionary>();
        public IDeferred<Dictionary> RunQuery(Dictionary friends)
        {
            RequestCount = ResponseCount = 0;
            Friends = friends;
            ArrayList friendBatches = SpitFriendsList(friends);
            for (int x = 0; x < friendBatches.Count; x++)
            {
                Friend[] batchFriends = (Friend[])friendBatches[x];
                Dictionary[] batch = new Dictionary[50];
                for (int y = 0; y < batchFriends.Length; y++)
                {
                    Dictionary d = new Dictionary("method", "GET", "relative_url", "me/mutualfriends/" + batchFriends[x].id);
                    batch[y] = d;
                }
                ApiOptions option = new ApiOptions();
                option.batch = batch;
                option.include_headers = false;
                Facebook.api("/", "POST", option, FacebookApiCallBack);
                RequestCount++;
            }
            return batchesComplete.Promise();
        }

        private void FacebookApiCallBack(ApiResponse[] response)
        {
            ResponseCount++;
            string element = jQuery.ParseJsonData<string>(response[0].body.ToString());
            if (ResponseCount == RequestCount)
            {
                Script.Literal("window.alert('alldone')");
                
            }
        }

        public static ArrayList SpitFriendsList(Dictionary list)
        {
            int splicecount = 50;
            ArrayList friendsList = new ArrayList();
            ArrayList currArray = new ArrayList();
            int counter = 0;
            jQuery.Each(list, delegate(string name, object value)
            {
                if (counter >= splicecount)
                {
                    friendsList.Add(currArray);
                    currArray = new ArrayList();
                    counter = 0;
                }
                currArray[counter] = (Friend)value;
                counter++;
            });
            friendsList.Add(currArray);
            return friendsList;
        }
    }
}
