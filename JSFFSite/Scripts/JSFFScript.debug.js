//! JSFFScript.debug.js
//

(function() {

Type.registerNamespace('JSFFScript');

////////////////////////////////////////////////////////////////////////////////
// JSFFScript.Friend

JSFFScript.Friend = function JSFFScript_Friend(_response, _canvasContext) {
    /// <param name="_response" type="FreindsLibrary.FriendInfo">
    /// </param>
    /// <param name="_canvasContext" type="CanvasContext2D">
    /// </param>
    /// <field name="_canvasContext" type="CanvasContext2D">
    /// </field>
    /// <field name="name" type="String">
    /// </field>
    /// <field name="id" type="String">
    /// </field>
    /// <field name="connections" type="Array">
    /// </field>
    this.name = _response.name;
    this.id = _response.id;
    this._canvasContext = _canvasContext;
    this.connections = [];
    var image = document.createElement('img');
    image.src = 'http://graph.facebook.com/' + this.id + '/picture';
    image.id = this.get_imageid();
    image.style.visibility = 'hidden';
    document.getElementById('images').insertBefore(image);
}
JSFFScript.Friend.prototype = {
    _canvasContext: null,
    name: null,
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
    
    drawImage: function JSFFScript_Friend$drawImage(_x, _y) {
        /// <param name="_x" type="Number">
        /// </param>
        /// <param name="_y" type="Number">
        /// </param>
        this._canvasContext.drawImage(this.get_getImageElement(), _x, _y);
    }
}


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
JSFFScript._FFJS.post = function JSFFScript__FFJS$post(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    var options = {};
    FB.api('/me/friends', function(apiResponse) {
        var canvas = document.getElementById('tutorial');
        var canvasContext = canvas.getContext('2d');
        for (var x = 0; x < apiResponse.data.length; x++) {
            var friend = new JSFFScript.Friend(apiResponse.data[x], canvasContext);
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
        for (var z = 0; z < Object.keys(JSFFScript._FFJS.friends).length; z++) {
            var f = JSFFScript._FFJS.friends[Object.keys(JSFFScript._FFJS.friends)[z]];
            var y = Math.floor(z / 20) * 50;
            var x = Math.floor(z % 20) * 50;
            f.drawImage(x, y);
        }
    });
}
JSFFScript._FFJS.logOut = function JSFFScript__FFJS$logOut(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    FB.logout(function() {
    });
    (document.getElementById('image')).src = '';
    $('#resultsDiv').html('');
}
JSFFScript._FFJS.onload = function JSFFScript__FFJS$onload() {
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
JSFFScript._FFJS.userID = null;
JSFFScript._FFJS.friends = {};
JSFFScript._FFJS.debug = false;
(function () {
    $(JSFFScript._FFJS.onload);
})();
})();

//! This script was generated using Script# v0.7.4.0
