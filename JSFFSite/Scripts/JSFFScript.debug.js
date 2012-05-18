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
}
JSFFScript._FFJS.buttonClicked = function JSFFScript__FFJS$buttonClicked(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    FB.getLoginStatus(function(loginResponse) {
        if (loginResponse.status === 'connected') {
            JSFFScript._FFJS.userID = loginResponse.authResponse.userID;
            (document.getElementById('image')).src = 'http://graph.facebook.com/' + JSFFScript._FFJS.userID + '/picture';
        }
        else {
            var options = {};
            options.scope = 'email, user_likes, publish_stream';
            FB.login(function(response) {
                if (!ss.isNull(response)) {
                    JSFFScript._FFJS.userID = response.authResponse.userID;
                    (document.getElementById('image')).src = 'http://graph.facebook.com/' + JSFFScript._FFJS.userID + '/picture';
                }
                else {
                    alert('Not Logged in ');
                }
            }, options);
        }
    });
}
JSFFScript._FFJS.post = function JSFFScript__FFJS$post(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    var options = {};
    FB.api('/me/friends', function(apiResponse) {
        var $enum1 = ss.IEnumerator.getEnumerator(apiResponse.data);
        while ($enum1.moveNext()) {
            var f = $enum1.current;
            f.connections = new Array(0);
            JSFFScript._FFJS.friends[f.id] = f;
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
                alert(queryResponse[2].fql_result_set.length);
                var $enum1 = ss.IEnumerator.getEnumerator(queryResponse[2].fql_result_set);
                while ($enum1.moveNext()) {
                    var result = $enum1.current;
                    (JSFFScript._FFJS.friends[result.uid1]).connections[(JSFFScript._FFJS.friends[result.uid1]).connections.length] = result.uid2;
                }
                alert(Object.getKeyCount(JSFFScript._FFJS.friends));
                var s = '';
                var $enum2 = ss.IEnumerator.getEnumerator(JSFFScript._FFJS.friends);
                while ($enum2.moveNext()) {
                    var f = $enum2.current;
                    s += f.id + ' -> ';
                    var $enum3 = ss.IEnumerator.getEnumerator(f.connections);
                    while ($enum3.moveNext()) {
                        var conns = $enum3.current;
                        s += conns + ',';
                    }
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
}
JSFFScript._FFJS.onload = function JSFFScript__FFJS$onload() {
    $('#MyButton').click(JSFFScript._FFJS.buttonClicked);
    $('#PostButton').click(JSFFScript._FFJS.post);
    $('#LogoutButton').click(JSFFScript._FFJS.logOut);
}


JSFFScript._FFJS.registerClass('JSFFScript._FFJS');
JSFFScript._FFJS.userID = null;
JSFFScript._FFJS.friends = {};
(function () {
    $(JSFFScript._FFJS.onload);
})();
})();

//! This script was generated using Script# v0.7.4.0
