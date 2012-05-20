// JSFFScript.js
(function(){
Type.registerNamespace('JSFFScript');JSFFScript.Friend=function(response){this.name=response.name;this.id=response.id;this.connections=[];}
JSFFScript.Friend.prototype={name:null,id:null,connections:null,x:0,y:0,get_imagetag:function(){return '<img id="image" src="http://graph.facebook.com/'+this.id+'/picture" alt="'+this.name+'" width="100", height="100"/>';}}
JSFFScript._FFJS=function(){}
JSFFScript._FFJS.$3=function($p0){var $0={};$0.scope='email, user_likes, publish_stream';FB.login(function($p1_0){
},$0);}
JSFFScript._FFJS.$4=function($p0){var $0={};FB.api('/me/friends',function($p1_0){
for(var $1_0=0;$1_0<$p1_0.data.length;$1_0++){var $1_1=new JSFFScript.Friend($p1_0.data[$1_0]);JSFFScript._FFJS.$1[$1_1.id]=$1_1;}if(ss.isNull($p1_0)||!ss.isNullOrUndefined($p1_0.error)){alert('error occured');}else{var $1_2={};$1_2.friendsLimit='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$0+' ORDER BY uid2';$1_2.friendsAll='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$0;$1_2.friendsoffriends='SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsLimit) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2';var $1_3={};$1_3.method='fql.multiquery';$1_3.queries=$1_2;FB.api($1_3,function($p2_0){
if(JSFFScript._FFJS.$2){alert($p2_0[2].fql_result_set.length);}for(var $2_1=0;$2_1<$p2_0[2].fql_result_set.length;$2_1++){var $2_2=$p2_0[2].fql_result_set[$2_1];(JSFFScript._FFJS.$1[$2_2.uid1]).connections.add($2_2.uid2);}if(JSFFScript._FFJS.$2){alert(Object.getKeyCount(JSFFScript._FFJS.$1));}var $2_0='';for(var $2_3=0;$2_3<Object.getKeyCount(JSFFScript._FFJS.$1);$2_3++){var $2_4=JSFFScript._FFJS.$1[Object.keys(JSFFScript._FFJS.$1)[$2_3]];$2_0+=$2_4.get_imagetag();$2_0+=' -> ';for(var $2_5=0;$2_5<$2_4.connections.length;$2_5++){var $2_6=JSFFScript._FFJS.$1[$2_4.connections[$2_5]];$2_0+=$2_6.get_imagetag();}$2_0+='<br/>';}$('#resultsDiv').html($2_0);});}});}
JSFFScript._FFJS.$5=function($p0){FB.logout(function(){
});(document.getElementById('image')).src='';$('#resultsDiv').html('');}
JSFFScript._FFJS.$6=function(){$('#MyButton').click(JSFFScript._FFJS.$3);$('#PostButton').click(JSFFScript._FFJS.$4);$('#LogoutButton').click(JSFFScript._FFJS.$5);FB.getLoginStatus(function($p1_0){
if($p1_0.status==='connected'){JSFFScript._FFJS.$0=$p1_0.authResponse.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+JSFFScript._FFJS.$0+'/picture';}});FB.Event.subscribe('auth.authResponseChange',function($p1_0){
if(JSFFScript._FFJS.$2){alert('Event Login Fired');}if($p1_0.status==='connected'){JSFFScript._FFJS.$0=$p1_0.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+$p1_0.userID+'/picture';}else{alert('Not Logged in ');}});}
JSFFScript.Friend.registerClass('JSFFScript.Friend');JSFFScript._FFJS.registerClass('JSFFScript._FFJS');JSFFScript._FFJS.$0=null;JSFFScript._FFJS.$1={};JSFFScript._FFJS.$2=true;(function(){$(JSFFScript._FFJS.$6);})();
})();// This script was generated using Script# v0.7.4.0
