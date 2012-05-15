// JSFFScript.js
(function(){
Type.registerNamespace('JSFFScript');JSFFScript._FFJS=function(){}
JSFFScript._FFJS.$1=function($p0){FB.getLoginStatus(function($p1_0){
if($p1_0.status==='connected'){JSFFScript._FFJS.$0=$p1_0.authResponse.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+JSFFScript._FFJS.$0+'/picture';}else{var $1_0={};$1_0.scope='email, user_likes, publish_stream';FB.login(function($p2_0){
if(!ss.isNull($p2_0)){JSFFScript._FFJS.$0=$p2_0.authResponse.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+JSFFScript._FFJS.$0+'/picture';}else{alert('Not Logged in ');}},$1_0);}});}
JSFFScript._FFJS.$2=function($p0){var $0={};FB.api('/me/friends',function($p1_0){
if(ss.isNull($p1_0)||!ss.isNullOrUndefined($p1_0.error)){alert('error occured');}else{var $1_0={};$1_0.friendsLimit='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$0+' ORDER BY uid2';$1_0.friendsAll='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$0;$1_0.friendsoffriends='SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsLimit) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2';var $1_1={};$1_1.method='fql.multiquery';$1_1.queries=$1_0;FB.api($1_1,function($p2_0){
alert($p2_0[2].fql_result_set.length);});}});}
JSFFScript._FFJS.$3=function(){$('#MyButton').click(JSFFScript._FFJS.$1);$('#PostButton').click(JSFFScript._FFJS.$2);}
JSFFScript._FFJS.registerClass('JSFFScript._FFJS');JSFFScript._FFJS.$0=null;(function(){$(JSFFScript._FFJS.$3);})();
})();// This script was generated using Script# v0.7.4.0
