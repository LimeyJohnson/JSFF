//! JSFFScript.debug.js
//

(function() {

Type.registerNamespace('JSFFScript');

////////////////////////////////////////////////////////////////////////////////
// JSFFScript.Friend

JSFFScript.Friend = function JSFFScript_Friend(response) {
    /// <param name="response" type="FreindsLibrary.FriendInfo">
    /// </param>
    /// <field name="name" type="String">
    /// </field>
    /// <field name="id" type="String">
    /// </field>
    /// <field name="connections" type="Array">
    /// </field>
    /// <field name="x" type="Number" integer="true">
    /// </field>
    /// <field name="y" type="Number" integer="true">
    /// </field>
    this.name = response.name;
    this.id = response.id;
    this.connections = [];
}
JSFFScript.Friend.prototype = {
    name: null,
    id: null,
    connections: null,
    x: 0,
    y: 0,
    
    get_imagetag: function JSFFScript_Friend$get_imagetag() {
        /// <value type="String"></value>
        return '<img id="image" src="http://graph.facebook.com/' + this.id + '/picture" alt="' + this.name + '" width="100", height="100"/>';
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
        for (var x = 0; x < apiResponse.data.length; x++) {
            var friend = new JSFFScript.Friend(apiResponse.data[x]);
            JSFFScript._FFJS.friends[friend.id] = friend;
        }
        if (ss.isNull(apiResponse) || !ss.isNullOrUndefined(apiResponse.error)) {
            alert('error occured');
        }
        else {
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
                }
                if (JSFFScript._FFJS.debug) {
                    alert(Object.getKeyCount(JSFFScript._FFJS.friends));
                }
                var s = '';
                for (var i = 0; i < Object.getKeyCount(JSFFScript._FFJS.friends); i++) {
                    var f = JSFFScript._FFJS.friends[Object.keys(JSFFScript._FFJS.friends)[i]];
                    s += f.get_imagetag();
                    s += ' -> ';
                    for (var x = 0; x < f.connections.length; x++) {
                        var otherf = JSFFScript._FFJS.friends[f.connections[x]];
                        s += otherf.get_imagetag();
                    }
                    s += '<br/>';
                }
                $('#resultsDiv').html(s);
            });
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
JSFFScript._FFJS.debug = true;
(function () {
    $(JSFFScript._FFJS.onload);
})();
})();

//! This script was generated using Script# v0.7.4.0
