/// <reference path="../scripts/typings/requirejs/require.d.ts" />
/// <reference path="main.ts" />



require(['Main',"d3","Facebook","jquery"],
    (main, d3, Facebook, $) => {
        // code from window.onload
        var appMain = new main.Main();
        appMain.run();
    });