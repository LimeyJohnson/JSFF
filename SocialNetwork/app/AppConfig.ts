/// <reference path="../scripts/typings/requirejs/require.d.ts" />
/// <reference path="main.ts" />


require.config({
    baseUrl: '/app',
    paths: {
        d3: "http://d3js.org/d3.v3.min",
        Facebook: "//connect.facebook.net/en_US/all",
        jquery: "../lib/jquery",
        jqueryUI: "../lib/jqueryui"
    },
    shim: {
        d3: {
            exports: "d3",
        },
        Facebook: {
            exports: "FB"
        },
        jqueryUI: {
            deps: ["jquery"],
            exports: "$"
        }

    }

});



require(['Main', "d3", "Facebook", "jqueryUI"],
    (main, d3, Facebook, $) => {
        // code from window.onload
        var facebookInfo = window.location.host == "localhost:26953" ?
            { appId: "157431201112518", channelURL: "http://localhost:26953/" } :
            { appId: "459808530803920", channelURL: "http://socialnetwork.limeyjohnson.net/channel.aspx" }
       
        main.Main($, d3, Facebook, facebookInfo);
        main.Main.start();
    });
