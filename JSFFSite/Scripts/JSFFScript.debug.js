//! JSFFScript.debug.js
//

(function() {

Type.registerNamespace('JSFFScript');

////////////////////////////////////////////////////////////////////////////////
// JSFFScript._FFJS

JSFFScript._FFJS = function JSFFScript__FFJS() {
    /// <field name="imagesize" type="Number" static="true">
    /// </field>
    /// <field name="imageOffSet" type="Number" static="true">
    /// </field>
    /// <field name="picsperaxis" type="Number" static="true">
    /// </field>
    /// <field name="iterator" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="userID" type="String" static="true">
    /// </field>
    /// <field name="friends" type="Object" static="true">
    /// </field>
    /// <field name="debug" type="Boolean" static="true">
    /// </field>
    /// <field name="canvas" type="Object" domElement="true" static="true">
    /// </field>
    /// <field name="group" type="JSFFScript.FriendsGroup" static="true">
    /// </field>
    /// <field name="canvasContext" type="CanvasContext2D" static="true">
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
    JSFFScript._FFJS.clearCanvas();
    var options = {};
    FB.api('/me/friends', function(apiResponse) {
        JSFFScript._FFJS.calcPidData(apiResponse.data.length);
        for (var x = 0; x < apiResponse.data.length; x++) {
            var xCord = (Math.floor(x % JSFFScript._FFJS.picsperaxis) * (JSFFScript._FFJS.imagesize + JSFFScript._FFJS.imageOffSet)) + JSFFScript._FFJS.imageOffSet;
            var yCord = (Math.floor(x / JSFFScript._FFJS.picsperaxis) * (JSFFScript._FFJS.imagesize + JSFFScript._FFJS.imageOffSet)) + JSFFScript._FFJS.imageOffSet;
            var friend = new JSFFScript.Friend(apiResponse.data[x], JSFFScript._FFJS.canvasContext, parseInt(xCord), parseInt(yCord));
            JSFFScript._FFJS.friends[friend.id] = friend;
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
                (JSFFScript._FFJS.friends[results.uid1]).connections.add(results.uid2);
                (JSFFScript._FFJS.friends[results.uid2]).connections.add(results.uid1);
            }
            if (JSFFScript._FFJS.debug) {
                alert(Object.getKeyCount(JSFFScript._FFJS.friends));
            }
        });
    });
    $('#tutorial').mousemove(JSFFScript._FFJS.mouseOverFriend);
    $('#tutorial').click(JSFFScript._FFJS.canvasClick);
}
JSFFScript._FFJS.calcPidData = function JSFFScript__FFJS$calcPidData(friendsCount) {
    /// <param name="friendsCount" type="Number" integer="true">
    /// </param>
    var totalLenght = JSFFScript._FFJS.canvas.width;
    JSFFScript._FFJS.picsperaxis = Math.ceil(Math.sqrt(friendsCount));
    JSFFScript._FFJS.imagesize = ((totalLenght - JSFFScript._FFJS.imageOffSet) / JSFFScript._FFJS.picsperaxis) - JSFFScript._FFJS.imageOffSet;
}
JSFFScript._FFJS.clearCanvas = function JSFFScript__FFJS$clearCanvas() {
    JSFFScript._FFJS.canvasContext.save();
    JSFFScript._FFJS.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    JSFFScript._FFJS.canvasContext.clearRect(0, 0, JSFFScript._FFJS.canvas.width, JSFFScript._FFJS.canvas.height);
    JSFFScript._FFJS.canvasContext.restore();
}
JSFFScript._FFJS.logOut = function JSFFScript__FFJS$logOut(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    FB.logout(function() {
    });
}
JSFFScript._FFJS.canvasClick = function JSFFScript__FFJS$canvasClick(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    JSFFScript._FFJS.clearCanvas();
    JSFFScript._FFJS.drawFriends();
    var f = JSFFScript._FFJS.pinPointFriend(e);
    if (ss.isNullOrUndefined(f)) {
        return;
    }
    JSFFScript._FFJS.selectFriends(f);
}
JSFFScript._FFJS.mouseOverFriend = function JSFFScript__FFJS$mouseOverFriend(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    var f = JSFFScript._FFJS.pinPointFriend(e);
    var text = '';
    if (!ss.isNullOrUndefined(f)) {
        text = f.name;
    }
    $('#friendName').text(text);
}
JSFFScript._FFJS.pinPointFriend = function JSFFScript__FFJS$pinPointFriend(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    /// <returns type="JSFFScript.Friend"></returns>
    for (var x = 0; x < Object.keys(JSFFScript._FFJS.friends).length; x++) {
        var f = JSFFScript._FFJS.friends[Object.keys(JSFFScript._FFJS.friends)[x]];
        if (f.get_x() < e.offsetX && (f.get_x() + JSFFScript._FFJS.imagesize) > e.offsetX && f.get_y() < e.offsetY && (f.get_y() + JSFFScript._FFJS.imagesize) > e.offsetY) {
            return f;
        }
    }
    return null;
}
JSFFScript._FFJS.selectFriends = function JSFFScript__FFJS$selectFriends(friend) {
    /// <param name="friend" type="JSFFScript.Friend">
    /// </param>
    for (var x = 0; x < friend.connections.length; x++) {
        var f = JSFFScript._FFJS.friends[friend.connections[x]];
        f.highlightSecondary();
    }
    friend.highlightPrimary();
}
JSFFScript._FFJS.drawLineBetweenFriends = function JSFFScript__FFJS$drawLineBetweenFriends(f1, f2) {
    /// <param name="f1" type="JSFFScript.Friend">
    /// </param>
    /// <param name="f2" type="JSFFScript.Friend">
    /// </param>
    JSFFScript._FFJS.canvasContext.beginPath();
    JSFFScript._FFJS.canvasContext.moveTo(f1.get_x(), f1.get_y());
    JSFFScript._FFJS.canvasContext.lineTo(f2.get_x(), f2.get_y());
    JSFFScript._FFJS.canvasContext.closePath();
    JSFFScript._FFJS.canvasContext.stroke();
}
JSFFScript._FFJS.drawFriends = function JSFFScript__FFJS$drawFriends() {
    for (var x = 0; x < Object.keys(JSFFScript._FFJS.friends).length; x++) {
        var friend = JSFFScript._FFJS.friends[Object.keys(JSFFScript._FFJS.friends)[x]];
        friend.drawImage();
    }
}
JSFFScript._FFJS.iterate = function JSFFScript__FFJS$iterate(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    JSFFScript._FFJS.group = new JSFFScript.FriendsGroup(JSFFScript._FFJS.friends);
    JSFFScript._FFJS.iterateSingle();
}
JSFFScript._FFJS.iterateSingle = function JSFFScript__FFJS$iterateSingle() {
    var uid = Object.keys(JSFFScript._FFJS.friends)[JSFFScript._FFJS.iterator % Object.keys(JSFFScript._FFJS.friends).length];
    JSFFScript._FFJS.group.iterateSingle(uid);
    JSFFScript._FFJS.clearCanvas();
    JSFFScript._FFJS.drawFriends();
    JSFFScript._FFJS.iterator++;
    if (JSFFScript._FFJS.iterator < 1000) {
        window.setTimeout(JSFFScript._FFJS.iterateSingle, 50);
    }
}
JSFFScript._FFJS.onload = function JSFFScript__FFJS$onload() {
    JSFFScript._FFJS.canvas = document.getElementById('tutorial');
    JSFFScript._FFJS.canvasContext = JSFFScript._FFJS.canvas.getContext('2d');
    $('#login').click(JSFFScript._FFJS.buttonClicked);
    $('#graph').click(JSFFScript._FFJS.graphFriends);
    $('#LogoutButton').click(JSFFScript._FFJS.logOut);
    $('#Iterate').click(JSFFScript._FFJS.iterate);
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
            JSFFScript._FFJS.clearCanvas();
        }
    });
}


////////////////////////////////////////////////////////////////////////////////
// JSFFScript.Friend

JSFFScript.Friend = function JSFFScript_Friend(_response, _canvasContext, _x, _y) {
    /// <param name="_response" type="FreindsLibrary.FriendInfo">
    /// </param>
    /// <param name="_canvasContext" type="CanvasContext2D">
    /// </param>
    /// <param name="_x" type="Number" integer="true">
    /// </param>
    /// <param name="_y" type="Number" integer="true">
    /// </param>
    /// <field name="_canvasContext" type="CanvasContext2D">
    /// </field>
    /// <field name="name" type="String">
    /// </field>
    /// <field name="position" type="JSFFScript.Point">
    /// </field>
    /// <field name="id" type="String">
    /// </field>
    /// <field name="connections" type="Array">
    /// </field>
    this.name = _response.name;
    this.id = _response.id;
    this._canvasContext = _canvasContext;
    this.position = new JSFFScript.Point();
    this.position.x = _x;
    this.position.y = _y;
    this.connections = [];
    var image = document.createElement('img');
    image.src = 'http://graph.facebook.com/' + this.id + '/picture';
    image.id = this.get_imageid();
    image.style.visibility = 'hidden';
    document.getElementById('images').insertBefore(image);
    $('#' + this.get_imageid()).one('load', ss.Delegate.create(this, this.drawLoadImage));
}
JSFFScript.Friend.prototype = {
    _canvasContext: null,
    name: null,
    position: null,
    id: null,
    connections: null,
    
    get_imageid: function JSFFScript_Friend$get_imageid() {
        /// <value type="String"></value>
        return 'image' + this.id;
    },
    
    get_getImageElement: function JSFFScript_Friend$get_getImageElement() {
        /// <value type="Object" domElement="true"></value>
        return document.getElementById(this.get_imageid());
    },
    
    highlightPrimary: function JSFFScript_Friend$highlightPrimary() {
        this._canvasContext.fillStyle = 'red';
        this._canvasContext.fillRect(this.get_x() - JSFFScript._FFJS.imageOffSet, this.get_y() - JSFFScript._FFJS.imageOffSet, JSFFScript._FFJS.imageOffSet * 2 + JSFFScript._FFJS.imagesize, JSFFScript._FFJS.imageOffSet * 2 + JSFFScript._FFJS.imagesize);
        this.drawImage();
    },
    
    highlightSecondary: function JSFFScript_Friend$highlightSecondary() {
        this._canvasContext.fillStyle = 'green';
        this._canvasContext.fillRect(this.get_x() - JSFFScript._FFJS.imageOffSet, this.get_y() - JSFFScript._FFJS.imageOffSet, JSFFScript._FFJS.imageOffSet * 2 + JSFFScript._FFJS.imagesize, JSFFScript._FFJS.imageOffSet * 2 + JSFFScript._FFJS.imagesize);
        this.drawImage();
    },
    
    drawLoadImage: function JSFFScript_Friend$drawLoadImage(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        this.drawImage();
    },
    
    drawImage: function JSFFScript_Friend$drawImage() {
        this._canvasContext.drawImage(this.get_getImageElement(), this.get_x(), this.get_y(), JSFFScript._FFJS.imagesize, JSFFScript._FFJS.imagesize);
    },
    
    get_x: function JSFFScript_Friend$get_x() {
        /// <value type="Number" integer="true"></value>
        return this.position.x;
    },
    set_x: function JSFFScript_Friend$set_x(value) {
        /// <value type="Number" integer="true"></value>
        this.position.x = value;
        return value;
    },
    
    get_y: function JSFFScript_Friend$get_y() {
        /// <value type="Number" integer="true"></value>
        return this.position.y;
    },
    set_y: function JSFFScript_Friend$set_y(value) {
        /// <value type="Number" integer="true"></value>
        this.position.y = value;
        return value;
    }
}


////////////////////////////////////////////////////////////////////////////////
// JSFFScript.FriendsGroup

JSFFScript.FriendsGroup = function JSFFScript_FriendsGroup(_Friends) {
    /// <param name="_Friends" type="Object">
    /// </param>
    /// <field name="friends" type="Object">
    /// </field>
    /// <field name="repulsionConstant" type="Number">
    /// </field>
    /// <field name="attractionConstant" type="Number">
    /// </field>
    /// <field name="vertexCount" type="Number" integer="true">
    /// </field>
    this.friends = _Friends;
    this.vertexCount = Object.keys(_Friends).length;
}
JSFFScript.FriendsGroup.prototype = {
    friends: null,
    repulsionConstant: 0.01,
    attractionConstant: 0.01,
    vertexCount: 0,
    
    _repelForce: function JSFFScript_FriendsGroup$_repelForce(target, actor) {
        /// <param name="target" type="JSFFScript.Friend">
        /// </param>
        /// <param name="actor" type="JSFFScript.Friend">
        /// </param>
        /// <returns type="JSFFScript.Vector"></returns>
        var distance = this._getDistance(target.get_x(), target.get_y(), actor.get_x(), actor.get_y());
        var xUnit = (target.get_x() - actor.get_x()) / distance;
        var yUnit = (target.get_y() - actor.get_y()) / distance;
        var result = new JSFFScript.Vector(0, 0);
        result.xCord = xUnit / (this.repulsionConstant * distance * distance);
        result.yCord = yUnit / (this.repulsionConstant * distance * distance);
        return result;
    },
    
    _attractForce: function JSFFScript_FriendsGroup$_attractForce(target, actor) {
        /// <param name="target" type="JSFFScript.Friend">
        /// </param>
        /// <param name="actor" type="JSFFScript.Friend">
        /// </param>
        /// <returns type="JSFFScript.Vector"></returns>
        var result = new JSFFScript.Vector(0, 0);
        result.xCord = this.attractionConstant * (actor.get_x() - target.get_x());
        result.yCord = this.attractionConstant * (actor.get_y() - target.get_y());
        return result;
    },
    
    _getDistance: function JSFFScript_FriendsGroup$_getDistance(x1, y1, x2, y2) {
        /// <param name="x1" type="Number">
        /// </param>
        /// <param name="y1" type="Number">
        /// </param>
        /// <param name="x2" type="Number">
        /// </param>
        /// <param name="y2" type="Number">
        /// </param>
        /// <returns type="Number"></returns>
        var result = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2, y1));
        return result;
    },
    
    iterate: function JSFFScript_FriendsGroup$iterate() {
        for (var x = 0; x < Object.keys(this.friends).length; x++) {
            this.iterateSingle(Object.keys(this.friends)[x]);
        }
    },
    
    iterateSingle: function JSFFScript_FriendsGroup$iterateSingle(id) {
        /// <param name="id" type="String">
        /// </param>
        var f = this.friends[id];
        var netForce = new JSFFScript.Vector(0, 0);
        for (var y = 0; y < Object.keys(this.friends).length; y++) {
            var b = this.friends[Object.keys(this.friends)[y]];
            if (f.id !== b.id) {
                if (f.connections.contains(b.id)) {
                    netForce.add(this._attractForce(f, b));
                }
                else {
                    netForce.add(this._repelForce(f, b));
                }
            }
        }
        f.set_x(f.get_x() + parseInt(netForce.xCord));
        f.set_y(f.get_y() + parseInt(netForce.yCord));
    }
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
JSFFScript.FriendsGroup.registerClass('JSFFScript.FriendsGroup');
JSFFScript.Vector.registerClass('JSFFScript.Vector');
JSFFScript.Point.registerClass('JSFFScript.Point');
JSFFScript._FFJS.imagesize = 0;
JSFFScript._FFJS.imageOffSet = 10;
JSFFScript._FFJS.picsperaxis = 0;
JSFFScript._FFJS.iterator = 0;
JSFFScript._FFJS.userID = null;
JSFFScript._FFJS.friends = {};
JSFFScript._FFJS.debug = false;
JSFFScript._FFJS.canvas = null;
JSFFScript._FFJS.group = null;
JSFFScript._FFJS.canvasContext = null;
(function () {
    $(JSFFScript._FFJS.onload);
})();
})();

//! This script was generated using Script# v0.7.4.0
