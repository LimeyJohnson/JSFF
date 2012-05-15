// JSFFScript.js
(function(){
Type.registerNamespace('JSFFScript');JSFFScript._FFJS=function(){}
JSFFScript._FFJS.$0=function($p0){alert('About to Log in');var $0={};$0.scope='email, user_likes, publish_stream';FB.login(function($p1_0){
if($p1_0.authResponse){alert('Logged in');FB.api('/me',function($p2_0){
alert('Good to see you'+$p2_0.name);(document.getElementById('image')).src='http://graph.facebook.com/'+$p2_0.id+'/picture';});}else{alert('Not Logged in ');}},$0);}
JSFFScript._FFJS.$1=function($p0){var $0={};$0.message="Gig'EM";FB.api('/me/feed','post',$0,function($p1_0){
if(ss.isNull($p1_0)||!ss.isNullOrUndefined($p1_0.error)){alert('error occured');}else{alert('Posted correctly');}});}
JSFFScript._FFJS.$2=function(){var $0={};$0.appId='240082229369859';$0.cookie=true;$0.xfbml=false;$0.channelUrl='limeyhouse.dyndns.org/channel.aspx';$0.status=false;FB.init($0);$('#MyButton').click(JSFFScript._FFJS.$0);$('#PostButton').click(JSFFScript._FFJS.$1);}
JSFFScript._FFJS.registerClass('JSFFScript._FFJS');(function(){$(JSFFScript._FFJS.$2);})();
})();// This script was generated using Script# v0.7.4.0
