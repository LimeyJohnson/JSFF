// Class1.cs
//

using System;
using System.Html;

using jQueryApi;
using System.Collections;
using FreindsLibrary;
using System.Html.Media.Graphics;
namespace JSFFScript
{

    internal static class FFJS
    {
        public static string UserID;
        public static Dictionary Friends = new Dictionary();
        public static bool debug = false;
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
                CanvasElement canvas = Document.GetElementById("tutorial").As<CanvasElement>();
                CanvasContext2D canvasContext = (CanvasContext2D)canvas.GetContext(Rendering.Render2D);
                for (int x = 0; x < apiResponse.data.Length; x++)
                {
                    Friend friend = new Friend(apiResponse.data[x], canvasContext);
                    Friends[friend.id] = friend;
                }
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
                        ((Friend)Friends[results.uid2]).connections.Add(results.uid1);
                    }
                    if (debug) Script.Alert(Friends.Count);
                }
                );
                for (int z = 0; z < Friends.Keys.Length; z++)
                {
                    Friend f = (Friend)Friends[Friends.Keys[z]];
                    double y = Math.Floor(z / 20) * 50;
                    double x = Math.Floor(z % 20) * 50;
                    f.drawImage(x, y);
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
            InitOptions options = new InitOptions();
            options.appId = "240082229369859";
            options.channelUrl = "//limeyhouse.dyndns.org/channel.aspx";
            options.status = true;
            options.cookie = true;
            options.xfbml = false;
            Facebook.init(options);
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
