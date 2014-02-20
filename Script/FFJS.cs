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
        public static bool FailCall = true;
        public static IQueryEngine QueryEngine = new FQLQuery();
        static FFJS()
        {
            jQuery.OnDocumentReady(new Action(Onload));
        }
        public static void ButtonClicked(jQueryEvent e)
        {
            LoginOptions options = new LoginOptions();
            options.scope = "email";
            Facebook.login(delegate(LoginResponse response) { }, options);
        }
        public static void GraphFriendsTweek(jQueryEvent e)
        {
            string charge = jQuery.Select("#charge").GetValue();
            string distance = jQuery.Select("#distance").GetValue();
            GraphFriends(null);
        }
        public static void GraphFriends(jQueryEvent e)
        {
            Date start = Date.Now;
            jQuery.Select("#canvas").Empty();
            Array nodes = new Array();
            Array links = new Array();
            ApiOptions options = new ApiOptions();
            Facebook.api("/me/friends", delegate(ApiResponse apiResponse)
            {
                if (!Script.Boolean(apiResponse.error))
                {
                    QueryFacebookForFreindsGraph(start, nodes, links, apiResponse);
                }
                else
                {
                    jQuery.Select("body").Append("Error: " + apiResponse.error.Message);
                }

            });
        }

        private static void QueryFacebookForFreindsGraph(Date start, Array nodes, Array links, ApiResponse apiResponse)
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
            jQuery.WhenData<Dictionary>(QueryEngine.RunQuery(Friends)).Then(delegate(Dictionary d)
            {
                Friends = d;
                BuildGraph(start, nodes, links);
            }, delegate(Dictionary D)
            {
                QueryEngine = new BatchQuery();
                jQuery.WhenData<Dictionary>(QueryEngine.RunQuery(Friends)).Then(delegate(Dictionary d)
                {

                }, delegate(Dictionary d)
                {

                });
            });
        }

        private static void BuildGraph(Date start, Array nodes, Array links)
        {

            Date finish = Date.Now;
            int milli = start.GetMilliseconds() - finish.GetMilliseconds();
            jQuery.Select("body").Append("query took: " + (milli / 1000));

            CreateSVG(nodes, links);
        }

        private static void CreateSVG(Array nodes, Array links)
        {
            int width = 960;
            int height = 800;

            jQuery.Each(Friends, delegate(string name, object value)
            {
                Friend f = (Friend)value;
                int originID = int.Parse(f.id);
                for(int x = 0; x<f.links.Count; x++)
                {
                    int targetID = int.Parse((string)f.links[x]);
                    if(originID<targetID)
                    {
                        Link newLink = new Link();
                        newLink.Source = f.index;
                        newLink.Target = ((Friend)Friends[(string)f.links[x]]).index;
                        newLink.Value = 1;
                        links[links.Length] = newLink;
                    }
                }
            });

            Zoom = D3.Behavior.Zoom().ScaleExtent(new double[] { 0.4, 4 }).On("zoom", Zoomed);

            ForceObject force = D3.Layout.Force().Charge(-120).LinkDistance(80).Size(new int[] { width, height });
            SVG = D3.Select("#canvas").Append("svg").Attr("width", width).Attr("height", height).Call(Zoom).Append("g");
            force.Nodes((Node[])nodes).Links((Link[])links).Start();
            Links = SVG.SelectAll(".link").Data((Link[])links).Enter().Append("line").Attr("class", "link").Style("stroke-width", delegate(Dictionary d) { return Math.Sqrt((int)d["value"]); });
            Nodes = SVG.SelectAll(".node").Data((Node[])nodes).Enter().Append("circle").Attr("class", "node").Attr("r", 7).Call(force.Drag)
                .On("mousemove", onMouseMove)
                .On("mouseover", onMouseOver)
                .On("mouseout", onMouseOut)
                .On("click", onNodeClick);


            Nodes.Append("title").Text(delegate(Dictionary D) { return (string)D["name"]; });
            force.On("tick", Update);
        }

        private static void onNodeClick(Dictionary arg)
        {
            SelectedID = (string)arg["id"] == SelectedID ? null : (string)arg["id"];
            Update();
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
                               if (!Script.Boolean(SelectedID)) return "black";
                               if (((Friend)Friends[SelectedID]).links.Contains(D["id"]))
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
            // callout.CSS("left", (int)d["x"] + 20);
            //callout.CSS("top", (int)d["y"] + 50);
        }
        public static void onMouseOver(Dictionary d)
        {
            D3.Event.StopPropagation();
            jQueryObject callout = jQuery.Select("#callout");
            callout.Show();
            string template = "<p><img src='http://graph.facebook.com/{0}/picture' alt='{1}' height='100' width='100'></p><p>{1}</p>";
            callout.Html(string.Format(template, d["id"], d["name"]));
        }
        public static void onMouseOut(Dictionary d)
        {
            D3.Event.StopPropagation();
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
            jQuery.Select("#graph").Click(new jQueryEventHandler(GraphFriendsTweek));
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
