/// <reference path="../scripts/typings/requirejs/require.d.ts" />
/// <reference path="appmain.ts" />



require(['AppMain'],
    (main) => {
        // code from window.onload
        var appMain = new main.AppMain();
        appMain.run();
    });