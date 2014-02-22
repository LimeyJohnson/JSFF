/// <reference path="../scripts/typings/d3/d3.d.ts" />
/// <reference path="../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../scripts/typings/facebook/facebook.d.ts" />



export class Main {
    $: JQueryStatic;
    d3: D3.Base;
    FB: IFacebook;
    userID: string;
    constructor(jQuery: JQueryStatic, d3: D3.Base, facebook: IFacebook) {
        this.$ = jQuery;
        this.d3 = d3;
        this.FB = facebook;
    }
    start() {
        $(() => {
            $('#login').click(this.loginHandler);
            $('#graph').click(this.graphFriends);
            FB.init({
                appId: '459808530803920',
                channelUrl: 'http://jsff.asurewebsites.com/channel.aspx',
                status: true,
                cookie: true,
                xfbml: false
            });
            FB.getLoginStatus((loginResponse) => {
                if (loginResponse.status === 'connected') {
                    this.userID = loginResponse.authResponse.userID;
                }
            });
            FB.Event.subscribe('auth.authResponseChange', (response) => {
                if (response.status === 'connected') {
                    this.userID = response.authResponse.userID;
                }
                else {
                }
            });
        });

    }
    loginHandler(event: JQueryEventObject) {
        FB.login((response) => {
        }, {
                scope: "email"
            });
    }
    graphFriends(event: JQueryEventObject) {

        var start = this.Time;
        $('#canvas').empty();
        var nodes: string[] = [];
        var links = [];
        FB.api('/me/friends', function (apiResponse) {
            if (!!!apiResponse.error) {
                queryFacebookForFreindsGraph(start, nodes, links, apiResponse);
            }
            else {
                $('body').append('Error: ' + apiResponse.error.message);
            }
        });
    }
    get Time():Number {
        var date: Date = new Date();
        return date.getTime();
    }
} 