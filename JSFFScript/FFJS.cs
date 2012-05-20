// Class1.cs
//

using System;
using System.Html;
using jQueryApi;
using System.Collections;
using FreindsLibrary;
namespace JSFFScript
{

    internal static class FFJS
    {
        public static string UserID;
        public static Dictionary Friends = new Dictionary();
        public static bool debug = true;
        static FFJS()
        {

            jQuery.OnDocumentReady(new Action(Onload));
        }
        public static void ButtonClicked(jQueryEvent e)
        {
                    LoginOptions options = new LoginOptions();
                    options.scope = "email, user_likes, publish_stream";
                    Facebook.login(delegate(LoginResponse response) { }, options);
        }
        public static void Post(jQueryEvent e)
        {
            ApiOptions options = new ApiOptions();
            Facebook.api("/me/friends", delegate(ApiResponse apiResponse)
            {

                for (int x = 0; x < apiResponse.data.Length; x++)
                {
                    Friend friend = new Friend(apiResponse.data[x]);
                    Friends[friend.id] = friend;
                }
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
                        if (debug) Script.Alert(queryResponse[2].fql_result_set.Length);
                        for (int i = 0; i < queryResponse[2].fql_result_set.Length; i++)
                        {
                            MultiQueryResults results = queryResponse[2].fql_result_set[i];
                            ((Friend)Friends[results.uid1]).connections.Add(results.uid2);
                        }
                        if (debug) Script.Alert(Friends.Count);
                        string s = "";
                        for (int i = 0; i < Friends.Count; i++)
                        {
                            Friend f = (Friend)Friends[Friends.Keys[i]];
                            s += f.imagetag;
                            s += " -> ";
                            for (int x = 0; x < f.connections.Count; x++)
                            {
                                Friend otherf = (Friend)Friends[(string)f.connections[x]];
                                s += otherf.imagetag;
                            }
                            s += "<br/>";
                        }
                        jQuery.Select("#resultsDiv").Html(s);
                    }
                    );
                }
            });
        }
        public static void LogOut(jQueryEvent e)
        {
            Facebook.logout(delegate() { });
            ((ImageElement)Document.GetElementById("image")).Src = "";
            jQuery.Select("#resultsDiv").Html("");

        }
        public static void Onload()
        {
            jQuery.Select("#MyButton").Click(new jQueryEventHandler(ButtonClicked));
            jQuery.Select("#PostButton").Click(new jQueryEventHandler(Post));
            jQuery.Select("#LogoutButton").Click(new jQueryEventHandler(LogOut));

            Facebook.getLoginStatus(delegate(LoginResponse loginResponse)
          {
              if (loginResponse.status == "connected")
              {
                  UserID = loginResponse.authResponse.userID;
                  ((ImageElement)Document.GetElementById("image")).Src = "http://graph.facebook.com/" + UserID + "/picture";
              }
          });
            Facebook.Event.subscribe("auth.authResponseChange", delegate(EventChangeResponse response)
            {
                if (debug) Script.Alert("Event Login Fired");
                if (response.status == "connected")
                {
                    UserID = response.userID;
                    ((ImageElement)Document.GetElementById("image")).Src = "http://graph.facebook.com/" + response.userID + "/picture";
                }
                else
                {
                    Script.Alert("Not Logged in ");
                }
            });
        }


    }
}
