// JSFFScript.js
(function(){
Type.registerNamespace('JSFFScript');JSFFScript._FFJS=function(){}
JSFFScript._FFJS.$2=function($p0){FB.getLoginStatus(function($p1_0){
if($p1_0.status==='connected'){JSFFScript._FFJS.$0=$p1_0.authResponse.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+JSFFScript._FFJS.$0+'/picture';}else{var $1_0={};$1_0.scope='email, user_likes, publish_stream';FB.login(function($p2_0){
if(!ss.isNull($p2_0)){JSFFScript._FFJS.$0=$p2_0.authResponse.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+JSFFScript._FFJS.$0+'/picture';}else{alert('Not Logged in ');}},$1_0);}});}
JSFFScript._FFJS.$3=function($p0){var $0={};FB.api('/me/friends',function($p1_0){
var $enum1=ss.IEnumerator.getEnumerator($p1_0.data);while($enum1.moveNext()){var $1_0=$enum1.current;$1_0.connections=new Array(0);JSFFScript._FFJS.$1[$1_0.id]=$1_0;}if(ss.isNull($p1_0)||!ss.isNullOrUndefined($p1_0.error)){alert('error occured');}else{var $1_1={};$1_1.friendsLimit='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$0+' ORDER BY uid2';$1_1.friendsAll='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$0;$1_1.friendsoffriends='SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsLimit) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2';var $1_2={};$1_2.method='fql.multiquery';$1_2.queries=$1_1;FB.api($1_2,function($p2_0){
alert($p2_0[2].fql_result_set.length);var $enum1=ss.IEnumerator.getEnumerator($p2_0[2].fql_result_set);while($enum1.moveNext()){var $2_1=$enum1.current;(JSFFScript._FFJS.$1[$2_1.uid1]).connections[(JSFFScript._FFJS.$1[$2_1.uid1]).connections.length]=$2_1.uid2;}alert(Object.getKeyCount(JSFFScript._FFJS.$1));var $2_0='';var $enum2=ss.IEnumerator.getEnumerator(JSFFScript._FFJS.$1);while($enum2.moveNext()){var $2_2=$enum2.current;$2_0+=$2_2.id+' -> ';var $enum3=ss.IEnumerator.getEnumerator($2_2.connections);while($enum3.moveNext()){var $2_3=$enum3.current;$2_0+=$2_3+',';}}$('#resultsDiv').html($2_0);});}});}
JSFFScript._FFJS.$4=function($p0){FB.logout(function(){
});(document.getElementById('image')).src='';}
JSFFScript._FFJS.$5=function(){$('#MyButton').click(JSFFScript._FFJS.$2);$('#PostButton').click(JSFFScript._FFJS.$3);$('#LogoutButton').click(JSFFScript._FFJS.$4);}
JSFFScript._FFJS.registerClass('JSFFScript._FFJS');JSFFScript._FFJS.$0=null;JSFFScript._FFJS.$1={};(function(){$(JSFFScript._FFJS.$5);})();
})();// This script was generated using Script# v0.7.4.0
