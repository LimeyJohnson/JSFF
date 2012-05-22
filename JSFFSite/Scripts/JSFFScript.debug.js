//! JSFFScript.debug.js
//

(function() {

Type.registerNamespace('JSFFScript');

////////////////////////////////////////////////////////////////////////////////
// JSFFScript.Friend

JSFFScript.Friend = function JSFFScript_Friend(_response, _canvasContext, _x, _y) {
    /// <param name="_response" type="FreindsLibrary.FriendInfo">
    /// </param>
    /// <param name="_canvasContext" type="CanvasContext2D">
    /// </param>
    /// <param name="_x" type="Number">
    /// </param>
    /// <param name="_y" type="Number">
    /// </param>
    /// <field name="_canvasContext" type="CanvasContext2D">
    /// </field>
    /// <field name="name" type="String">
    /// </field>
    /// <field name="x" type="Number">
    /// </field>
    /// <field name="y" type="Number">
    /// </field>
    /// <field name="id" type="String">
    /// </field>
    /// <field name="connections" type="Array">
    /// </field>
    this.name = _response.name;
    this.id = _response.id;
    this._canvasContext = _canvasContext;
    this.x = _x;
    this.y = _y;
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
    x: 0,
    y: 0,
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
        this._canvasContext.fillRect(this.x - JSFFScript._FFJS.imageOffSet, this.y - JSFFScript._FFJS.imageOffSet, JSFFScript._FFJS.imageOffSet * 2 + JSFFScript._FFJS.imagesize, JSFFScript._FFJS.imageOffSet * 2 + JSFFScript._FFJS.imagesize);
        this.drawImage();
    },
    
    highlightSecondary: function JSFFScript_Friend$highlightSecondary() {
        this._canvasContext.fillStyle = 'green';
        this._canvasContext.fillRect(this.x - JSFFScript._FFJS.imageOffSet, this.y - JSFFScript._FFJS.imageOffSet, JSFFScript._FFJS.imageOffSet * 2 + JSFFScript._FFJS.imagesize, JSFFScript._FFJS.imageOffSet * 2 + JSFFScript._FFJS.imagesize);
        this.drawImage();
    },
    
    drawLoadImage: function JSFFScript_Friend$drawLoadImage(e) {
        /// <param name="e" type="jQueryEvent">
        /// </param>
        this.drawImage();
    },
    
    drawImage: function JSFFScript_Friend$drawImage() {
        this._canvasContext.drawImage(this.get_getImageElement(), this.x, this.y, JSFFScript._FFJS.imagesize, JSFFScript._FFJS.imagesize);
    }
}


////////////////////////////////////////////////////////////////////////////////
// JSFFScript._FFJS

JSFFScript._FFJS = function JSFFScript__FFJS() {
    /// <field name="imagesize" type="Number" static="true">
    /// </field>
    /// <field name="imageOffSet" type="Number" static="true">
    /// </field>
    /// <field name="picsperaxis" type="Number" static="true">
    /// </field>
    /// <field name="userID" type="String" static="true">
    /// </field>
    /// <field name="friends" type="Object" static="true">
    /// </field>
    /// <field name="debug" type="Boolean" static="true">
    /// </field>
    /// <field name="canvas" type="Object" domElement="true" static="true">
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
JSFFScript._FFJS.post = function JSFFScript__FFJS$post(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    JSFFScript._FFJS.clearCanvas();
    var options = {};
    FB.api('/me/friends', function(apiResponse) {
        JSFFScript._FFJS.calcPidData(apiResponse.data.length);
        for (var x = 0; x < apiResponse.data.length; x++) {
            var xCord = (Math.floor(x % JSFFScript._FFJS.picsperaxis) * (JSFFScript._FFJS.imagesize + JSFFScript._FFJS.imageOffSet)) + JSFFScript._FFJS.imageOffSet;
            var yCord = (Math.floor(x / JSFFScript._FFJS.picsperaxis) * (JSFFScript._FFJS.imagesize + JSFFScript._FFJS.imageOffSet)) + JSFFScript._FFJS.imageOffSet;
            var friend = new JSFFScript.Friend(apiResponse.data[x], JSFFScript._FFJS.canvasContext, xCord, yCord);
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
    (document.getElementById('image')).src = '';
    $('#resultsDiv').html('');
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
        if (f.x < e.offsetX && (f.x + JSFFScript._FFJS.imagesize) > e.offsetX && f.y < e.offsetY && (f.y + JSFFScript._FFJS.imagesize) > e.offsetY) {
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
JSFFScript._FFJS.drawFriends = function JSFFScript__FFJS$drawFriends() {
    for (var x = 0; x < Object.keys(JSFFScript._FFJS.friends).length; x++) {
        var friend = JSFFScript._FFJS.friends[Object.keys(JSFFScript._FFJS.friends)[x]];
        friend.drawImage();
    }
}
JSFFScript._FFJS.onload = function JSFFScript__FFJS$onload() {
    JSFFScript._FFJS.canvas = document.getElementById('tutorial');
    JSFFScript._FFJS.canvasContext = JSFFScript._FFJS.canvas.getContext('2d');
    $('#MyButton').click(JSFFScript._FFJS.buttonClicked);
    $('#PostButton').click(JSFFScript._FFJS.post);
    $('#LogoutButton').click(JSFFScript._FFJS.logOut);
    var options = {};
    options.appId = '240082229369859';
    options.channelUrl = '//limeyhouse.dyndns.org/channel.aspx';
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
            JSFFScript._FFJS.userID = response.userID;
            (document.getElementById('image')).src = 'http://graph.facebook.com/' + response.userID + '/picture';
        }
        else {
            alert('Not Logged in ');
        }
    });
}


JSFFScript.Friend.registerClass('JSFFScript.Friend');
JSFFScript._FFJS.registerClass('JSFFScript._FFJS');
JSFFScript._FFJS.imagesize = 0;
JSFFScript._FFJS.imageOffSet = 10;
JSFFScript._FFJS.picsperaxis = 0;
JSFFScript._FFJS.userID = null;
JSFFScript._FFJS.friends = {};
JSFFScript._FFJS.debug = false;
JSFFScript._FFJS.canvas = null;
JSFFScript._FFJS.canvasContext = null;
(function () {
    $(JSFFScript._FFJS.onload);
})();
})();

//! This script was generated using Script# v0.7.4.0
