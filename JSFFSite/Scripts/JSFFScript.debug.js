//! JSFFScript.debug.js
//

(function() {

Type.registerNamespace('JSFFScript');

////////////////////////////////////////////////////////////////////////////////
// JSFFScript._FFJS

JSFFScript._FFJS = function JSFFScript__FFJS() {
    /// <field name="userID" type="String" static="true">
    /// </field>
    /// <field name="friends" type="Object" static="true">
    /// </field>
    /// <field name="debug" type="Boolean" static="true">
    /// </field>
}
JSFFScript._FFJS.buttonClicked = function JSFFScript__FFJS$buttonClicked(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    var options = {};
    options.scope = 'email, user_likes, publish_stream';
    FB.login(function(response) {
    }, options);
}
JSFFScript._FFJS.graphFriends = function JSFFScript__FFJS$graphFriends(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    var nodes = [];
    var links = [];
    var options = {};
    FB.api('/me/friends', function(apiResponse) {
        for (var x = 0; x < apiResponse.data.length; x++) {
            var friend = new JSFFScript.Friend(apiResponse.data[x], x);
            JSFFScript._FFJS.friends[friend.id] = friend;
            var noeNode = {};
            noeNode.name = friend.name;
            noeNode.group = 1;
            nodes[nodes.length] = noeNode;
        }
        var q = {};
        q.friendsLimit = 'SELECT uid1, uid2 from friend WHERE uid1 = ' + JSFFScript._FFJS.userID + ' ORDER BY uid2';
        q.friendsAll = 'SELECT uid1, uid2 from friend WHERE uid1 = ' + JSFFScript._FFJS.userID;
        q.friendsoffriends = 'SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsLimit) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2';
        var queryOptions = {};
        queryOptions.method = 'fql.multiquery';
        queryOptions.queries = q;
        FB.api(queryOptions, function(queryResponse) {
            if (JSFFScript._FFJS.debug) {
                alert(queryResponse[2].fql_result_set.length);
            }
            for (var i = 0; i < queryResponse[2].fql_result_set.length; i++) {
                var results = queryResponse[2].fql_result_set[i];
                var target = (JSFFScript._FFJS.friends[results.uid1]);
                var origin = (JSFFScript._FFJS.friends[results.uid2]);
                var newLink = {};
                newLink.source = origin.index;
                newLink.target = target.index;
                newLink.value = 1;
                links[links.length] = newLink;
            }
            var width = 960;
            var height = 500;
            var force = d3.layout.force().charge(-120).linkDistance(30).size([ width, height ]);
            var svg = d3.select('#canvas').append('svg').attr('width', width).attr('height', height);
            force.nodes(nodes).links(links).start();
            var link = svg.selectAll('.link').data(links).enter().append('line').attr('class', 'link').style('stroke-width', function(d) {
                return Math.sqrt(d['value']);
            });
            var node = svg.selectAll('.node').data(nodes).enter().append('circle').attr('class', 'node').attr('r', 5).call(force.drag);
            node.append('title').text(function(D) {
                return D['name'];
            });
            force.on('tick', function() {
                link.attr('x1', function(D) {
                    return (D['source'])['x'];
                }).attr('y1', function(D) {
                    return (D['source'])['y'];
                }).attr('x2', function(D) {
                    return (D['target'])['x'];
                }).attr('y1', function(D) {
                    return (D['target'])['y'];
                });
                node.attr('cx', function(D) {
                    return D['x'];
                }).attr('cy', function(D) {
                    return D['y'];
                });
            });
            if (JSFFScript._FFJS.debug) {
                alert(Object.getKeyCount(JSFFScript._FFJS.friends));
            }
        });
    });
}
JSFFScript._FFJS.logOut = function JSFFScript__FFJS$logOut(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    FB.logout(function() {
    });
}
JSFFScript._FFJS.onload = function JSFFScript__FFJS$onload() {
    $('#login').click(JSFFScript._FFJS.buttonClicked);
    $('#graph').click(JSFFScript._FFJS.graphFriends);
    $('#LogoutButton').click(JSFFScript._FFJS.logOut);
    var options = {};
    options.appId = '459808530803920';
    options.channelUrl = 'http://localhost/channel.aspx';
    options.status = true;
    options.cookie = true;
    options.xfbml = false;
    FB.init(options);
    FB.getLoginStatus(function(loginResponse) {
        if (loginResponse.status === 'connected') {
            JSFFScript._FFJS.userID = loginResponse.authResponse.userID;
            (document.getElementById('image')).src = 'http://graph.facebook.com/' + JSFFScript._FFJS.userID + '/picture';
        }
    });
    FB.Event.subscribe('auth.authResponseChange', function(response) {
        if (JSFFScript._FFJS.debug) {
            alert('Event Login Fired');
        }
        if (response.status === 'connected') {
            JSFFScript._FFJS.userID = response.authResponse.userID;
            (document.getElementById('image')).src = 'http://graph.facebook.com/' + JSFFScript._FFJS.userID + '/picture';
        }
        else {
            (document.getElementById('image')).src = '';
        }
    });
}


////////////////////////////////////////////////////////////////////////////////
// JSFFScript.Friend

JSFFScript.Friend = function JSFFScript_Friend(_response, _index) {
    /// <param name="_response" type="FreindsLibrary.FriendInfo">
    /// </param>
    /// <param name="_index" type="Number" integer="true">
    /// </param>
    /// <field name="name" type="String">
    /// </field>
    /// <field name="id" type="String">
    /// </field>
    /// <field name="index" type="Number" integer="true">
    /// </field>
    this.name = _response.name;
    this.id = _response.id;
    this.index = _index;
}
JSFFScript.Friend.prototype = {
    name: null,
    id: null,
    index: 0
}


////////////////////////////////////////////////////////////////////////////////
// JSFFScript.Vector

JSFFScript.Vector = function JSFFScript_Vector(X, Y) {
    /// <param name="X" type="Number">
    /// </param>
    /// <param name="Y" type="Number">
    /// </param>
    /// <field name="xCord" type="Number">
    /// </field>
    /// <field name="yCord" type="Number">
    /// </field>
    this.xCord = X;
    this.yCord = Y;
}
JSFFScript.Vector.prototype = {
    xCord: 0,
    yCord: 0,
    
    add: function JSFFScript_Vector$add(add) {
        /// <param name="add" type="JSFFScript.Vector">
        /// </param>
        this.xCord += add.xCord;
        this.yCord += add.yCord;
    }
}


////////////////////////////////////////////////////////////////////////////////
// JSFFScript.Point

JSFFScript.Point = function JSFFScript_Point() {
    /// <field name="x" type="Number" integer="true">
    /// </field>
    /// <field name="y" type="Number" integer="true">
    /// </field>
}
JSFFScript.Point.prototype = {
    x: 0,
    y: 0,
    
    addVector: function JSFFScript_Point$addVector(v) {
        /// <param name="v" type="JSFFScript.Vector">
        /// </param>
        this.x += parseInt(v.xCord);
        this.y += parseInt(v.yCord);
    }
}


JSFFScript._FFJS.registerClass('JSFFScript._FFJS');
JSFFScript.Friend.registerClass('JSFFScript.Friend');
JSFFScript.Vector.registerClass('JSFFScript.Vector');
JSFFScript.Point.registerClass('JSFFScript.Point');
JSFFScript._FFJS.userID = null;
JSFFScript._FFJS.friends = {};
JSFFScript._FFJS.debug = false;
(function () {
    $(JSFFScript._FFJS.onload);
})();
})();

//! This script was generated using Script# v0.7.4.0
