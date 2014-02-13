// FFJS.cs
//
using System;
using System.Html;
using jQueryApi;
using System.Collections;
using FreindsLibrary;
using D3Api;
using System.Html.Media.Graphics;
namespace JSFFScript
{

    internal static class FFJS
    {
        public static string UserID;
        public static Dictionary Friends = new Dictionary();
        public static string SelectedID = null;
        public static SelectObject Links;
        public static SelectObject Nodes;
        public static BehaviorObject Zoom;
        public static SelectObject SVG;
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
        public static void GraphFriends(jQueryEvent e)
        {
            Array nodes = new Array();
            Array links = new Array();
            ApiOptions options = new ApiOptions();
            Facebook.api("/me/friends", delegate(ApiResponse apiResponse)
            {
                for (int x = 0; x < ((FriendInfo[])apiResponse.data).Length; x++)
                {
                    Friend friend = new Friend(((FriendInfo[])apiResponse.data)[x], x);
                    Friends[friend.id] = friend;
                    Node noeNode = new Node();
                    noeNode.Name = friend.name;
                    noeNode.Group = 1;
                    noeNode.ID = friend.id;
                    nodes[nodes.Length] = noeNode;

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
                    for (int i = 0; i < queryResponse[2].fql_result_set.Length; i++)
                    {
                        MultiQueryResults results = queryResponse[2].fql_result_set[i];
                        Friend target = ((Friend)Friends[results.uid1]);
                        Friend origin = ((Friend)Friends[results.uid2]);
                        origin.links.Add(target.id);
                        target.links.Add(origin.id);
                        Link newLink = new Link();
                        newLink.Source = origin.index;
                        newLink.Target = target.index;
                        newLink.Value = 1;
                        links[links.Length] = newLink;
                    }
                    int width = 960;
                    int height = 500;

                    Zoom = D3.Behavior.Zoom().ScaleExtent(new int[] {-100,100}).On("zoom", Zoomed);

                    ForceObject force = D3.Layout.Force().Charge(-120).LinkDistance(30).Size(new int[] { width, height });
                    SVG = D3.Select("#canvas").Append("svg").Attr("width", width).Attr("height", height).Call(Zoom).Append("g");
                    force.Nodes((Node[])nodes).Links((Link[])links).Start();
                    Links = SVG.SelectAll(".link").Data((Link[])links).Enter().Append("line").Attr("class", "link").Style("stroke-width", delegate(Dictionary d) { return Math.Sqrt((int)d["value"]); });
                    Nodes = SVG.SelectAll(".node").Data((Node[])nodes).Enter().Append("circle").Attr("class", "node").Attr("r", 7).Call(force.Drag)
                        .On("mousemove", onMouseMove)
                        .On("mouseover", onMouseOver)
                        .On("mouseout", onMouseOut);

                    Nodes.Append("title").Text(delegate(Dictionary D) { return (string)D["name"]; });
                    force.On("tick", Update);
                    
                }
                );
            });
        }

        private static void Zoomed(Dictionary arg)
        {
            SVG.Attr("transform", "translate(" + D3.Event.Translate + ")scale(" + D3.Event.Scale + ")");
        }
        public static void Update()
        {
            Links.Attr("x1", delegate(Dictionary D) { return (int)((Dictionary)D["source"])["x"]; }).
                Attr("y1", delegate(Dictionary D) { return (int)((Dictionary)D["source"])["y"]; }).
                Attr("x2", delegate(Dictionary D) { return (int)((Dictionary)D["target"])["x"]; }).
                Attr("y2", delegate(Dictionary D) { return (int)((Dictionary)D["target"])["y"]; }).
                Style("stroke-width", delegate(Dictionary D)
                {
                    if (Script.Boolean(SelectedID) && MatchesTargetOrSource(D, SelectedID))
                    {
                        return 2;
                    }
                    else
                    {
                        return 1;
                    }
                });
            Nodes.Attr("cx", delegate(Dictionary D) { return (int)D["x"]; }).
                           Attr("cy", delegate(Dictionary D) { return (int)D["y"]; }).
                           Attr("fill", delegate(Dictionary D)
                           {
                               if(!Script.Boolean(SelectedID)) return "black";
                               if(((Friend)Friends[SelectedID]).links.Contains(D["id"]))
                               {
                                   return "red";
                               }
                               return D["id"] == SelectedID ? "green" : "black";
                           });
        }
        public static void onMouseMove(Dictionary d)
        {
            D3.Event.StopPropagation();
            jQueryObject callout = jQuery.Select("#callout");
            callout.CSS("left", (int)d["x"] + 20);
            callout.CSS("top", (int)d["y"] + 50);
        }
        public static void onMouseOver(Dictionary d)
        {
            D3.Event.StopPropagation();
            SelectedID = (string)d["id"];
            Update();
            jQueryObject callout = jQuery.Select("#callout");
            callout.Show();
            string template = "<p><img src='http://graph.facebook.com/{0}/picture' alt='{1}' height='100' width='100'></p><p>{1}</p>";
            callout.Html(string.Format(template, d["id"], d["name"]));
        }
        public static void onMouseOut(Dictionary d)
        {
            D3.Event.StopPropagation();
            SelectedID = null;
            Update();
            jQueryObject callout = jQuery.Select("#callout");
            callout.Hide();
        }
        public static bool MatchesTargetOrSource(Dictionary d, string id)
        {
            return ((Dictionary)d["source"])["id"] == id ||
                ((Dictionary)d["target"])["id"] == id;
        }
        public static void LogOut(jQueryEvent e)
        {
            Facebook.logout(delegate(LoginResponse response) { });
        }
        public static void Onload()
        {
            jQuery.Select("#login").Click(new jQueryEventHandler(ButtonClicked));
            jQuery.Select("#graph").Click(new jQueryEventHandler(GraphFriends));
            InitOptions options = new InitOptions();
            options.appId = "459808530803920";
            options.channelUrl = "http://jsff.asurewebsites.com/channel.aspx";
            options.status = true;
            options.cookie = true;
            options.xfbml = false;
            Facebook.init(options);
            Facebook.getLoginStatus(delegate(LoginResponse loginResponse)
            {
                if (loginResponse.status == "connected")
                {
                    UserID = loginResponse.authResponse.userID;
                }
            });
            Facebook.Event.subscribe("auth.authResponseChange", delegate(LoginResponse response)
            {
                if (response.status == "connected")
                {
                    UserID = response.authResponse.userID;
                }
                else
                {
                }
            });
        }


    }
}
