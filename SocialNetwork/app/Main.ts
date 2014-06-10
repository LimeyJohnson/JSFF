/// <reference path="../scripts/typings/d3/d3.d.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../scripts/typings/facebook/facebook.d.ts" />
/// <reference path="../scripts/typings/jqueryui/jqueryui.d.ts" />

import F = require("./classes/friend");
import Q = require("./classes/queryengine");
import S = require("./classes/friendstats");
export interface fbInfo {
    appId: string;
    channelURL: string;
}

export class Main {
    static $: JQueryStatic;
    static d3: D3.Base;
    static FB: IFacebook;
    static UserID: string;
    static Friends: F.FriendMap;
    static QueryEngine: Q.IQueryEngine = new Q.FQLQuery();
    static Zoom: D3.Behavior.Zoom;
    static Svg: D3.Selection;
    static Links: D3.Selection;
    static Nodes: D3.Selection;
    static SelectedID: string;
    static FacebookInfo: fbInfo;
    constructor(jQuery: JQueryStatic, d3: D3.Base, facebook: IFacebook, facebookInfo: fbInfo) {
        Main.$ = jQuery;
        Main.d3 = d3;
        Main.FB = facebook;
        Main.FacebookInfo = facebookInfo;
    }
    static start() {
        $(() => {
            $('#login').click((event) => Main.loginHandler(event));
            FB.init({
                appId: Main.FacebookInfo.appId,
                channelUrl: Main.FacebookInfo.channelURL,
                status: true,
                cookie: true,
                xfbml: false
            });
            FB.getLoginStatus((loginResponse) => {
                if (loginResponse.status === 'connected') {
                    Main.UserID = loginResponse.authResponse.userID;
                }
            });
            FB.Event.subscribe('auth.authResponseChange', (response) => {
                if (response.status === 'connected') {
                    Main.UserID = response.authResponse.userID;
                }
                else {
                }
            });
        });

    }
    static loginHandler(event: JQueryEventObject) {
        FB.login((response) => {
            Main.UserID = response.authResponse.userID;
            Main.graphFriends(null);
        }, { scope: "email" });
    }
    static clearVariables() {
        Main.Friends = {};

        $('#canvas').empty();
        Main.Svg = null;
        Main.Links = null;
        Main.Nodes = null;
        Main.Zoom = null;
    }
    static graphFriends(event: JQueryEventObject) {
        Main.clearVariables();
        var start = Main.Time;
        FB.api('/me/friends', (apiResponse) => {
            if (!!!apiResponse.error) {
                Main.queryFacebookForFreindsGraph(start, apiResponse);
            }
            else {
                $('body').append('Error: ' + apiResponse.error.message);
            }
        });
    }
    static get Time(): number {
        var date: Date = new Date();
        return date.getTime();
    }
    static queryFacebookForFreindsGraph(start: number, apiResponse) {
        for (var x = 0; x < (apiResponse.data).length; x++) {
            var friend = new F.Friend();
            friend.id = apiResponse.data[x].id;
            friend.name = apiResponse.data[x].name;
            friend.index = x;
            Main.Friends[friend.id] = friend;

        }
        Main.QueryEngine.RunQuery(Main.Friends, Main.FB).then((d: F.FriendMap) => {
            Main.Friends = d;
            S.FriendStats.GetFriendStats(Main.Friends);
            Main.createSVG(start);
        }, (...reasons: any[]) => {
                Main.QueryEngine = new Q.BatchQuery();
                Main.QueryEngine.RunQuery(Main.Friends, Main.FB).then((d) => {
                    Main.Friends = d;
                    S.FriendStats.GetFriendStats(Main.Friends);
                    Main.createSVG(start);
                }, function (...reasons: any[]) {
                        window.alert("Failed Batch Query");
                    });
            });
    }

    static createSVG(start: number) {
        $(".chartshow").show();
        $(".charthide").hide();
        var finish: number = Main.Time;
        var milli = finish - start;
        var nodes: D3.Layout.GraphNode[] = [];
        var links: D3.Layout.GraphLink[] = [];
        var width = 960;
        var height = 800;
        for (var friendID in Main.Friends) {
            var f: F.Friend = Main.Friends[friendID];
            nodes.push({
                name: f.name,
                group: 1,
                id: f.id
            });
            for (var x = 0; x < f.links.length; x++) {
                if (f.id < f.links[x]) {
                    links.push({
                        source: f.index,
                        target: (Main.Friends[f.links[x]]).index
                    });
                }
            }
        }
        $('body').append('Friends: ' + nodes.length + "<br/>");
        $('body').append('Connections: ' + links.length + "<br/>");
        //Main.Zoom = Main.d3.behavior.zoom().scaleExtent([0.4, 4]).on('zoom',Main.zoomed);
        var force = Main.d3.layout.force().charge(Main.Charge).linkDistance(Main.LinkDistance).size([width, height]);
        Main.Svg = Main.d3.select('#canvas').append('svg').attr('width', width).attr('height', height)/*.call(Main.Zoom)*/.append('g');
        force.nodes(nodes).links(links).start();
        Main.Links = Main.Svg.selectAll('.link').data(links).enter().append('line').attr('class', 'link');
        Main.Nodes = Main.Svg.selectAll('.node').data(nodes).enter().append('circle').attr('class', 'node').attr('r', 7).call(force.drag).on('mousemove', Main.onMouseMove).on('mouseover', Main.onMouseOver).on('mouseout', Main.onMouseOut).on('click', Main.onNodeClick);
        Main.Nodes.append('title').text(function (D: D3.Layout.GraphNode) {
            return D.name;
        });
        force.on('tick', Main.update);
        Main.setupAutocomplete();
    }
    static setupAutocomplete() {
        $("#friendsautocomplete").autocomplete({
            select: Main.AutoCompleteValueSelect,
            source: Main.AutoCompleteSource
        });
    }
    static AutoCompleteSource(request, response) {
        var matcher = new RegExp("\\b" + $.ui.autocomplete.escapeRegex(request.term), "i");
        var matchArray: JQueryUI.AutocompleteItem[] = [];
        for (var key in Main.Friends) {
            if (matcher.test(Main.Friends[key].name)) matchArray.push({ label: Main.Friends[key].name, value: Main.Friends[key].id });
        }
        response(matchArray);

    }
    static AutoCompleteValueSelect(event, ui: JQueryUI.AutocompleteUIParams) {
        Main.SelectUser(ui.item.value);
    }
    static update() {
        Main.Links.attr('x1', function (D: D3.Layout.GraphLink) {
            return (D.source.x);
        }).attr('y1', function (D: D3.Layout.GraphLink) {
                return D.source.y;
            }).attr('x2', function (D: D3.Layout.GraphLink) {
                return D.target.x;
            }).attr('y2', function (D: D3.Layout.GraphLink) {
                return D.target.y;
            }).style('stroke-width', function (D: D3.Layout.GraphLink) {
                if (!!Main.SelectedID && Main.matchesTargetOrSource(D, Main.SelectedID)) {
                    return 2;
                }
                else {
                    return 1;
                }
            });
        Main.Nodes.attr('cx', function (D: D3.Layout.GraphNode) {
            return D.x;
        }).attr('cy', function (D: D3.Layout.GraphNode) {
                return D.y;
            }).attr('fill', function (D: D3.Layout.GraphNode) {
                if (!!!Main.SelectedID) {
                    return 'black';
                }
                if (((Main.Friends[Main.SelectedID]).links.indexOf(D.id) >= 0)) {
                    return 'red';
                }
                return (D.id.toString() == Main.SelectedID) ? 'green' : 'black';
            });
    }
    static onMouseMove(d) {
        Main.d3.event.stopPropagation();
        var callout = $('#callout');
    }
    static onMouseOver(d: D3.Layout.GraphNode) {
        Main.d3.event.stopPropagation();
        var callout = $('#callout');
        callout.show();
        var template: string = "<p><img src='http://graph.facebook.com/{0}/picture' alt='{1}' height='100' width='100'></p><p>{1} ({0})</p>";
        callout.html(template.replace("{0}", d.id).replace("{0}", d.id).replace("{1}", d.name).replace("{1}", d.name));
    }
    static onMouseOut = function (d) {
        Main.d3.event.stopPropagation();
        var callout = $('#callout');
        callout.hide();
    }
    static onNodeClick(arg) {
        Main.SelectUser(arg.id);
    }
    static zoomed(arg) {
        Main.Svg.attr('transform', 'translate(' + Main.d3.event.translate + ')scale(' + Main.d3.event.scale + ')');
    }
    static matchesTargetOrSource(d: D3.Layout.GraphLink, id: string) {
        return (d.source.id == id || d.target.id == id);
    }
    static SelectUser(id: string) {
        Main.SelectedID = id == Main.SelectedID ? null : id;
        Main.update();
    }
    static get Charge(): number {
        var defaultCharge: number = -120;
        var chargeTxt = $("#charge").val();
        try {
            return isNaN(parseInt(chargeTxt)) ? defaultCharge : parseInt(chargeTxt);
        }
        catch (err) {
            return defaultCharge;
        }
    }
    static get LinkDistance(): number {
        var defaultDist: number = 80;
        var chargeTxt = $("#distance").val();
        try {
            return isNaN(parseInt(chargeTxt)) ? defaultDist : parseInt(chargeTxt);
        }
        catch (err) {
            return defaultDist;
        }
    }
} 