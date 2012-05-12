//! JSFFScript.debug.js
//

(function() {

Type.registerNamespace('JSFFScript');

////////////////////////////////////////////////////////////////////////////////
// JSFFScript._FFJS

JSFFScript._FFJS = function JSFFScript__FFJS() {
}
JSFFScript._FFJS.buttonClicked = function JSFFScript__FFJS$buttonClicked(sender, e) {
    /// <param name="sender" type="Object">
    /// </param>
    /// <param name="e" type="ss.EventArgs">
    /// </param>
    alert('this worked');
}


JSFFScript._FFJS.registerClass('JSFFScript._FFJS');
(function () {
    var options = {};
    options.appId = '240082229369859';
    options.cookie = true;
    options.xfbml = false;
    options.channelUrl = 'http://limeyhouse.dyndns.org/channel.aspx';
    options.status = false;
    FB.init(options);
    alert('Go TO BED');
})();
})();

//! This script was generated using Script# v0.7.4.0
