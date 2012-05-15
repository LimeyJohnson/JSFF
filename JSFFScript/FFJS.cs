// Class1.cs
//

using System;
using System.Collections.Generic;
using System.Html;
using FriendsLibrary;
using jQueryApi;
namespace JSFFScript
{

    internal static class FFJS
    {
        public static string UserID;
        static FFJS()
        {
            jQuery.OnDocumentReady(new Action(Onload));
        }
        public static void ButtonClicked(jQueryEvent e)
        {
            Facebook.getLoginStatus(delegate(LoginResponse loginResponse)
            {
                if (loginResponse.status == "connected")
                {
                    UserID = loginResponse.authResponse.userID;
                    ((ImageElement)Document.GetElementById("image")).Src = "http://graph.facebook.com/" + UserID + "/picture";
                }
                else
                {
                    LoginOptions options = new LoginOptions();
                    options.scope = "email, user_likes, publish_stream";
                    Facebook.login(delegate(LoginResponse response)
                    {
                        if (!Script.IsNull(response))
                        {
                            UserID = response.authResponse.userID;
                            ((ImageElement)Document.GetElementById("image")).Src = "http://graph.facebook.com/" + UserID + "/picture";
                        }
                        else
                        {
                            Script.Alert("Not Logged in ");
                        }
                    }, options
                        );
                }
            });

        }
        public static void Post(jQueryEvent e)
        {
            ApiOptions options = new ApiOptions();
            Facebook.api("/me/friends", delegate(ApiResponse apiResponse)
            {
                if (Script.IsNull(apiResponse) || !Script.IsNullOrUndefined(apiResponse.error))
                {
                    Script.Alert("error occured");
                }
                else
                {
                    Queries q = new Queries();
                    q.friendsLimit = "SELECT uid1, uid2 from friend WHERE uid1 = " + UserID + " ORDER BY uid2";
                    q.friendsAll = "SELECT uid1, uid2 from friend WHERE uid1 = " + UserID;
                    q.friendsoffriends = "SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsLimit) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2";

                    ApiOptions queryOptions = new ApiOptions();
                    queryOptions.method = "fql.multiquery";
                    queryOptions.queries = q;

                    Facebook.api(queryOptions, delegate(QueryResponse[] queryResponse)
                    {
                        Script.Alert(queryResponse[2].fql_result_set.Length);
                    }
                    );
                }
            });
        }
        public static void Onload()
        {
            jQuery.Select("#MyButton").Click(new jQueryEventHandler(ButtonClicked));
            jQuery.Select("#PostButton").Click(new jQueryEventHandler(Post));
        }
    }
}
