/// <reference path="../scripts/typings/requirejs/require.d.ts" />
/// <reference path="main.ts" />


require.config({
    baseUrl: '/app',
    paths: {
        d3: "http://d3js.org/d3.v3.min",
        Facebook: "//connect.facebook.net/en_US/all",
        jquery: "../lib/jquery"
    },
    shim: {
        d3: {
            exports: "d3",
        },
        Facebook: {
            exports: "FB"
        },
        jquery: {
            exports: "$"
        }

    }

});

require(['Main', "d3", "Facebook", "jquery"],
    (main, d3, Facebook, $) => {
        // code from window.onload
        var appMain = new main.Main($, d3, Facebook);
        appMain.start();
    });
