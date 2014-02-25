/// <reference path="../scripts/typings/d3/d3.d.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../scripts/typings/facebook/facebook.d.ts" />

import F = require("./classes/friend");
import Q = require("./classes/queryengine");

export class Main {
    $: JQueryStatic;
    static d3: D3.Base;
    FB: IFacebook;
    userID: string;
    static friends: F.FriendMap;
    queryEngine: Q.IQueryEngine = new Q.FQLQuery(FB);
    static zoom: D3.Behavior.Zoom;
    static svg: D3.Selection;
    static links: D3.Selection;
    static nodes: D3.Selection;
    static selectedID: string;
    constructor(jQuery: JQueryStatic, d3: D3.Base, facebook: IFacebook) {
        this.$ = jQuery;
        Main.d3 = d3;
        this.FB = facebook;
        Main.friends = {};
        var seome = new F.Friend();
    }
    start() {
        $(() => {
            $('#login').click((event) => this.loginHandler(event));
            $('#graph').click((event) => this.graphFriends(event));
            FB.init({
                appId: '459808530803920',
                channelUrl: 'http://jsff.asurewebsites.com/channel.aspx',
                status: true,
                cookie: true,
                xfbml: false
            });
            FB.getLoginStatus((loginResponse) => {
                if (loginResponse.status === 'connected') {
                    this.userID = loginResponse.authResponse.userID;
                }
            });
            FB.Event.subscribe('auth.authResponseChange', (response) => {
                if (response.status === 'connected') {
                    this.userID = response.authResponse.userID;
                }
                else {
                }
            });
        });

    }
    loginHandler(event: JQueryEventObject) {
        FB.login((response) => {}, { scope: "email" });
    }
    graphFriends(event: JQueryEventObject) {
        var start = this.Time;
        $('#canvas').empty();
        var nodes: string[] = [];
        var links = [];
        FB.api('/me/friends', (apiResponse) => {
            if (!!!apiResponse.error) {
                this.queryFacebookForFreindsGraph(start, nodes, links, apiResponse);
            }
            else {
                $('body').append('Error: ' + apiResponse.error.message);
            }
        });
    }
    get Time(): number {
        var date: Date = new Date();
        return date.getTime();
    }
    queryFacebookForFreindsGraph(start: number, nodes: D3.Layout.GraphNode[], links, apiResponse) {
        for (var x = 0; x < (apiResponse.data).length; x++) {
            var friend = new F.Friend();
            friend.id = apiResponse.data[x].id;
            friend.name = apiResponse.data[x].name;
            friend.index = x;
            Main.friends[friend.id] = friend;
            nodes.push({
                name: friend.name,
                group: 1,
                id: friend.id
            });
        }
        this.queryEngine.RunQuery(Main.friends).then((d: F.FriendMap) => {
            Main.friends = d;
            this.createSVG(start, nodes, links);
        }, (...reasons: any[]) => {
                this.queryEngine = new Q.BatchQuery(FB);
                this.queryEngine.RunQuery(Main.friends).then( (d)=> {
                    Main.friends = d;
                    this.createSVG(start, nodes, links);
                }, function (...reasons: any[]) {
                    });
            });
    }
   
    createSVG(start: number, nodes, links: D3.Layout.GraphLink[]) {
        var finish: number = this.Time;
        var milli = start - finish;
        $('body').append('query took: ' + (milli / 1000));
        var width = 960;
        var height = 800;
        for (var friendID in Main.friends) {
            var f: F.Friend = Main.friends[friendID];
            for (var x = 0; x < f.links.length; x++) {
                if (f.id < f.links[x]) {
                    links.push({
                    source: f.index,
                        target: (Main.friends[f.links[x]]).index
                    });
                }
            }
        }
        Main.zoom = Main.d3.behavior.zoom().scaleExtent([0.4, 4]).on('zoom', () =>this.zoomed);
        var force = Main.d3.layout.force().charge(-120).linkDistance(80).size([width, height]);
        Main.svg = Main.d3.select('#canvas').append('svg').attr('width', width).attr('height', height).call(Main.zoom).append('g');
        force.nodes(nodes).links(links).start();
        Main.links = Main.svg.selectAll('.link').data(links).enter().append('line').attr('class', 'link').style('stroke-width', function (d) {
            return Math.sqrt(d['value']);
        });
        Main.nodes = Main.svg.selectAll('.node').data(nodes).enter().append('circle').attr('class', 'node').attr('r', 7).call(force.drag).on('mousemove', this.onMouseMove).on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut).on('click', Main.onNodeClick);
        Main.nodes.append('title').text(function (D) {
            return D['name'];
        });
        force.on('tick', Main.update);
    }
    static update () {
        Main.links.attr('x1', function (D) {
            return (D['source'])['x'];
        }).attr('y1', function (D) {
                return (D['source'])['y'];
            }).attr('x2', function (D) {
                return (D['target'])['x'];
            }).attr('y2', function (D) {
                return (D['target'])['y'];
            }).style('stroke-width', function (D) {
                if (!!Main.selectedID && Main.matchesTargetOrSource(D, Main.selectedID)) {
                    return 2;
                }
                else {
                    return 1;
                }
            });
        Main.nodes.attr('cx', function (D) {
            return D['x'];
        }).attr('cy', function (D) {
                return D['y'];
            }).attr('fill', function (D) {
                if (!!!Main.selectedID) {
                    return 'black';
                }
                if (((Main.friends[Main.selectedID]).links.indexOf(D['id']) >= 0)) {
                    return 'red';
                }
                return (D['id'] === Main.selectedID) ? 'green' : 'black';
            });
    }
    onMouseMove (d) {
        Main.d3.event.stopPropagation();
        var callout = $('#callout');
    }
    onMouseOver (d) {
        Main.d3.event.stopPropagation();
        var callout = $('#callout');
        callout.show();
        var template:string = "<p><img src='http://graph.facebook.com/{0}/picture' alt='{1}' height='100' width='100'></p><p>{1}</p>";
        callout.html(template, d['id'], d['name']));
    }
    onMouseOut = function (d) {
        Main.d3.event.stopPropagation();
        var callout = $('#callout');
        callout.hide();
    }
    static onNodeClick(arg) {
        Main.selectedID = (arg['id'] == Main.selectedID) ? null : arg['id'];
        Main.update();
    }
    zoomed(arg) {
        Main.svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    }
    static matchesTargetOrSource(d, id) {
        return (d['source'])['id'] === id || (d['target'])['id'] === id;
    }
} 