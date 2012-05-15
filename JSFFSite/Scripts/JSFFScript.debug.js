//! JSFFScript.debug.js
//

(function() {

Type.registerNamespace('JSFFScript');

////////////////////////////////////////////////////////////////////////////////
// JSFFScript._FFJS

JSFFScript._FFJS = function JSFFScript__FFJS() {
}
JSFFScript._FFJS.buttonClicked = function JSFFScript__FFJS$buttonClicked(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    alert('About to Log in');
    var options = {};
    options.scope = 'email, user_likes, publish_stream';
    FB.login(function(response) {
        if (response.authResponse) {
            alert('Logged in');
            FB.api('/me', function(apiResponse) {
                alert('Good to see you' + apiResponse.name);
                (document.getElementById('image')).src = 'http://graph.facebook.com/' + apiResponse.id + '/picture';
            });
        }
        else {
            alert('Not Logged in ');
        }
    }, options);
}
JSFFScript._FFJS.post = function JSFFScript__FFJS$post(e) {
    /// <param name="e" type="jQueryEvent">
    /// </param>
    var options = {};
    options.message = "Gig'EM";
    FB.api('/me/feed', 'post', options, function(apiResponse) {
        if (ss.isNull(apiResponse) || !ss.isNullOrUndefined(apiResponse.error)) {
            alert('error occured');
        }
        else {
            alert('Posted correctly');
        }
    });
}
JSFFScript._FFJS.onload = function JSFFScript__FFJS$onload() {
    var options = {};
    options.appId = '240082229369859';
    options.cookie = true;
    options.xfbml = false;
    options.channelUrl = 'limeyhouse.dyndns.org/channel.aspx';
    options.status = false;
    FB.init(options);
    $('#MyButton').click(JSFFScript._FFJS.buttonClicked);
    $('#PostButton').click(JSFFScript._FFJS.post);
}


JSFFScript._FFJS.registerClass('JSFFScript._FFJS');
(function () {
    $(JSFFScript._FFJS.onload);
})();
})();

//! This script was generated using Script# v0.7.4.0
