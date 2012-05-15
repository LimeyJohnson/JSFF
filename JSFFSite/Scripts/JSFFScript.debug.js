//! JSFFScript.debug.js
//

(function() {

Type.registerNamespace('JSFFScript');

////////////////////////////////////////////////////////////////////////////////
// JSFFScript._FFJS

JSFFScript._FFJS = function JSFFScript__FFJS() {
    /// <field name="userID" type="String" static="true">
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
            });
        }
    });
}
JSFFScript._FFJS.onload = function JSFFScript__FFJS$onload() {
    $('#MyButton').click(JSFFScript._FFJS.buttonClicked);
    $('#PostButton').click(JSFFScript._FFJS.post);
}


JSFFScript._FFJS.registerClass('JSFFScript._FFJS');
JSFFScript._FFJS.userID = null;
(function () {
    $(JSFFScript._FFJS.onload);
})();
})();

//! This script was generated using Script# v0.7.4.0
