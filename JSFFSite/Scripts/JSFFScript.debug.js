//! JSFFScript.debug.js
//

(function() {

Type.registerNamespace('JSFFScript');

////////////////////////////////////////////////////////////////////////////////
// JSFFScript._FFJS

JSFFScript._FFJS = function JSFFScript__FFJS() {
}


JSFFScript._FFJS.registerClass('JSFFScript._FFJS');
(function () {
    var options = {};
    options.appId = 'Somethings';
    options.cookie = false;
    window.addEventListener('load', function(e) {
        FB.init(options);
    }, false);
})();
})();

//! This script was generated using Script# v0.7.4.0
