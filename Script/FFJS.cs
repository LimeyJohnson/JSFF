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
        public static double imagesize = 0;
        public static double imageOffSet = 10;
        public static double picsperaxis = 0;
        public static int iterator = 0;
        public static string UserID;
        public static Dictionary Friends = new Dictionary();
        public static bool debug = false;
        public static CanvasElement canvas;
        public static FriendsGroup group;
        public static CanvasContext2D canvasContext;
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
            ClearCanvas();
            ApiOptions options = new ApiOptions();
            Facebook.api("/me/friends", delegate(ApiResponse apiResponse)
            {
                CalcPidData(apiResponse.data.Length);
                for (int x = 0; x < apiResponse.data.Length; x++)
                {
                    double xCord = (Math.Floor(x % picsperaxis) * (imagesize + imageOffSet)) + imageOffSet;
                    double yCord = (Math.Floor(x / picsperaxis) * (imagesize + imageOffSet)) + imageOffSet;
                    Friend friend = new Friend(apiResponse.data[x], canvasContext, (int)xCord, (int)yCord);
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
              

            });
            jQuery.Select("#tutorial").MouseMove(new jQueryEventHandler(MouseOverFriend));
            jQuery.Select("#tutorial").Click(new jQueryEventHandler(CanvasClick));
        }
        public static void CalcPidData(int friendsCount)
        {
            int totalLenght = canvas.Width;
            picsperaxis = Math.Ceil(Math.Sqrt(friendsCount));
            imagesize = ((totalLenght - imageOffSet) / picsperaxis) - imageOffSet;
        }
        public static void ClearCanvas()
        {
            canvasContext.Save();
            canvasContext.SetTransform(1, 0, 0, 1, 0, 0);
            canvasContext.ClearRect(0, 0, canvas.Width, canvas.Height);
            canvasContext.Restore();
        }
        public static void LogOut(jQueryEvent e)
        {
            Facebook.logout(delegate() { });
            

        }
        public static void CanvasClick(jQueryEvent e)
        {
            ClearCanvas();
            DrawFriends();
            Friend f = PinPointFriend(e);
            if (Script.IsNullOrUndefined(f)) return;
            SelectFriends(f);
            
        }
        public static void MouseOverFriend(jQueryEvent e)
        {
            Friend f = PinPointFriend(e);
            string text = "";
            if (!Script.IsNullOrUndefined(f)) text = f.name; 
            jQuery.Select("#friendName").Text(text);
        }
        public static Friend PinPointFriend(jQueryEvent e)
        {
            for (int x = 0; x < Friends.Keys.Length; x++)
            {
                Friend f = (Friend)Friends[Friends.Keys[x]];
                if (f.X < e.OffsetX && (f.X + imagesize) > e.OffsetX && f.Y < e.OffsetY && (f.Y + imagesize) > e.OffsetY)
                {
                    return f;
                }
            }
            return null;
        }
        public static void SelectFriends(Friend friend)
        {
            
            for (int x = 0; x < friend.connections.Count; x++)
            {
                Friend f = (Friend)Friends[(string)friend.connections[x]];
                f.highlightSecondary();
               // DrawLineBetweenFriends(friend, f);
            }
            friend.highlightPrimary();

        }
        public static void DrawLineBetweenFriends(Friend f1, Friend f2)
        {
            canvasContext.BeginPath();
            canvasContext.MoveTo(f1.X, f1.Y);
            canvasContext.LineTo(f2.X, f2.Y);
            canvasContext.ClosePath();
            canvasContext.Stroke();
        }
        public static void DrawFriends()
        {
            for (int x = 0; x < Friends.Keys.Length; x++)
            {
                Friend friend = (Friend)Friends[Friends.Keys[x]];
                friend.drawImage();
            }
        }
        public static void Iterate(jQueryEvent e)
        {
            group = new FriendsGroup(Friends);
            //group.iterate();
            //ClearCanvas();
            //DrawFriends();
            IterateSingle();
        }
        public static void IterateSingle()
        {
            string uid = Friends.Keys[iterator % Friends.Keys.Length];
            group.iterateSingle(uid);
            ClearCanvas();
            DrawFriends();
            iterator++;
            if (iterator < 1000) Window.SetTimeout(IterateSingle, 50);
        }
        public static void Onload()
        {
            canvas = Document.GetElementById("tutorial").As<CanvasElement>();
             canvasContext = (CanvasContext2D)canvas.GetContext(Rendering.Render2D);
            jQuery.Select("#MyButton").Click(new jQueryEventHandler(ButtonClicked));
            jQuery.Select("#PostButton").Click(new jQueryEventHandler(Post));
            jQuery.Select("#LogoutButton").Click(new jQueryEventHandler(LogOut));
            jQuery.Select("#Iterate").Click(new jQueryEventHandler(Iterate));
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
            Facebook.Event.subscribe("auth.authResponseChange", delegate(LoginResponse response)
            {
                if (debug) Script.Alert("Event Login Fired");
                if (response.status == "connected")
                {
                    UserID = response.authResponse.userID;
                    ((ImageElement)Document.GetElementById("image")).Src = "http://graph.facebook.com/" + UserID + "/picture";
                }
                else
                {
                    ((ImageElement)Document.GetElementById("image")).Src = "";
                    ClearCanvas();
                }
            });
        }


    }
}
