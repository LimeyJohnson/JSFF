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
    FB.login(function(response) {
        if (response.authResponse) {
            alert('Logged in');
            FB.api('/me', function(apiResponse) {
                alert('Good to see you' + apiResponse.name);
            });
        }
        else {
            alert('Not Logged in ');
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
}


JSFFScript._FFJS.registerClass('JSFFScript._FFJS');
(function () {
    $(JSFFScript._FFJS.onload);
})();
})();

//! This script was generated using Script# v0.7.4.0
