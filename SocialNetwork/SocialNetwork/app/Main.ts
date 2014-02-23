/// <reference path="../scripts/typings/d3/d3.d.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../scripts/typings/facebook/facebook.d.ts" />

import F = require("./classes/friend");
import Q = require("./classes/queryengine");

export class Main {
    $: JQueryStatic;
    d3: D3.Base;
    FB: IFacebook;
    userID: string;
    friends: F.FriendMap;
    queryEngine: Q.IQueryEngine = new Q.FQLQuery(FB);
    zoom: D3.Behavior.Zoom;
    svg: D3.Selection;
    links: D3.Selection;
    nodes: D3.Selection;
    selectedID: string;
    constructor(jQuery: JQueryStatic, d3: D3.Base, facebook: IFacebook) {
        this.$ = jQuery;
        this.d3 = d3;
        this.FB = facebook;
        this.friends = {};
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
    queryFacebookForFreindsGraph(start: Number, nodes: D3.Layout.GraphNode[], links, apiResponse) {
        for (var x = 0; x < (apiResponse.data).length; x++) {
            var friend = new F.Friend();
            friend.id = apiResponse.data[x];
            friend.index = x;
            this.friends[friend.id] = friend;
            nodes.push({
                name: friend.name,
                group: 1,
                id: friend.id
            });
        }
        $.when(this.queryEngine.RunQuery(this.friends)).then(function (d: F.FriendMap) {
            this.friends = d;
            this.buildGraph(start, nodes, links);
        }, function (...reasons: any[]) {
                this.queryEngine = new Q.BatchQuery(FB);
                $.when(this.queryEngine.RunQuery(this.friends)).then(function (d) {
                    this.friends = d;
                    this.buildGraph(start, nodes, links);
                }, function (...reasons: any[]) {
                    });
            });
    }
    buildGraph(start:number, nodes, links) {
        var finish:number = this.Time;
        var milli = start - finish;
        $('body').append('query took: ' + (milli / 1000));
        this.createSVG(nodes, links);
    }
    createSVG(nodes, links: D3.Layout.GraphLink[]) {
        var width = 960;
        var height = 800;
        $.each(this.friends, function (name, value) {
            var f = value;
            var originID = parseInt(f.id);
            for (var x = 0; x < f.links.length; x++) {
                var targetID = parseInt(f.links[x]);
                if (originID < targetID) {
                    links.push({
                    source: f.index,
                    target: (this.friends[f.links[x]]).index
                    });
                }
            }
        });
        this.zoom = d3.behavior.zoom().scaleExtent([0.4, 4]).on('zoom',this.zoomed);
        var force = d3.layout.force().charge(-120).linkDistance(80).size([width, height]);
        this.svg =  d3.select('#canvas').append('svg').attr('width', width).attr('height', height).call(this.zoom).append('g');
        force.nodes(nodes).links(links).start();
        this.links = this.svg.selectAll('.link').data(links).enter().append('line').attr('class', 'link').style('stroke-width', function (d) {
            return Math.sqrt(d['value']);
        });
        this.nodes = this.svg.selectAll('.node').data(nodes).enter().append('circle').attr('class', 'node').attr('r', 7).call(force.drag).on('mousemove', this.onMouseMove).on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut).on('click', this.onNodeClick);
        this.nodes.append('title').text(function (D) {
            return D['name'];
        });
        force.on('tick', this.update);
    }
    update () {
        this.links.attr('x1', function (D) {
            return (D['source'])['x'];
        }).attr('y1', function (D) {
                return (D['source'])['y'];
            }).attr('x2', function (D) {
                return (D['target'])['x'];
            }).attr('y2', function (D) {
                return (D['target'])['y'];
            }).style('stroke-width', function (D) {
                if (!!this.selectedID && Main.matchesTargetOrSource(D, this.selectedID)) {
                    return 2;
                }
                else {
                    return 1;
                }
            });
        this.nodes.attr('cx', function (D) {
            return D['x'];
        }).attr('cy', function (D) {
                return D['y'];
            }).attr('fill', function (D) {
                if (!!!this.selectedID) {
                    return 'black';
                }
                if (((this.friends[this.selectedID]).links.indexOf(D['id']) >= 0)) {
                    return 'red';
                }
                return (D['id'] === this.selectedID) ? 'green' : 'black';
            });
    }
    onMouseMove (d) {
        d3.event.stopPropagation();
        var callout = $('#callout');
    }
    onMouseOver (d) {
        d3.event.stopPropagation();
        var callout = $('#callout');
        callout.show();
        var template = "<p><img src='http://graph.facebook.com/{0}/picture' alt='{1}' height='100' width='100'></p><p>{1}</p>";
        callout.html(/*ss.format(template, d['id'], d['name'])*/);
    }
    onMouseOut = function (d) {
        d3.event.stopPropagation();
        var callout = $('#callout');
        callout.hide();
    }
    onNodeClick(arg) {
        this.selectedID = (arg['id'] == this.selectedID) ? null : arg['id'];
        this.update();
    }
    zoomed(arg) {
        this.svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
    }
    static matchesTargetOrSource(d, id) {
        return (d['source'])['id'] === id || (d['target'])['id'] === id;
    }
} 