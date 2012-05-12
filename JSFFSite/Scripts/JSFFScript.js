// JSFFScript.js
(function(){
Type.registerNamespace('JSFFScript');JSFFScript._FFJS=function(){}
JSFFScript._FFJS.$0=function($p0){alert('About to Log in');FB.login(function($p1_0){
if($p1_0.authResponse){alert('Logged in');FB.api('/me',function($p2_0){
alert('Good to see you'+$p2_0.name);});}else{alert('Not Logged in ');}});}
JSFFScript._FFJS.$1=function(){var $0={};$0.appId='240082229369859';$0.cookie=true;$0.xfbml=false;$0.channelUrl='limeyhouse.dyndns.org/channel.aspx';$0.status=false;FB.init($0);$('#MyButton').click(JSFFScript._FFJS.$0);}
JSFFScript._FFJS.registerClass('JSFFScript._FFJS');(function(){$(JSFFScript._FFJS.$1);})();
})();// This script was generated using Script# v0.7.4.0
