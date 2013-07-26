// JSFFScript.js
(function(){
Type.registerNamespace('JSFFScript');JSFFScript._FFJS=function(){}
JSFFScript._FFJS.$3=function($p0){var $0={};$0.scope='email, user_likes, publish_stream';FB.login(function($p1_0){
},$0);}
JSFFScript._FFJS.$4=function($p0){var $0=[];var $1=[];var $2={};FB.api('/me/friends',function($p1_0){
for(var $1_2=0;$1_2<$p1_0.data.length;$1_2++){var $1_3=new JSFFScript.Friend($p1_0.data[$1_2],$1_2);JSFFScript._FFJS.$1[$1_3.id]=$1_3;var $1_4={};$1_4.name=$1_3.name;$1_4.group=1;$0[$0.length]=$1_4;}var $1_0={};$1_0.friendsLimit='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$0+' ORDER BY uid2';$1_0.friendsAll='SELECT uid1, uid2 from friend WHERE uid1 = '+JSFFScript._FFJS.$0;$1_0.friendsoffriends='SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsLimit) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2';var $1_1={};$1_1.method='fql.multiquery';$1_1.queries=$1_0;FB.api($1_1,function($p2_0){
if(JSFFScript._FFJS.$2){alert($p2_0[2].fql_result_set.length);}for(var $2_6=0;$2_6<$p2_0[2].fql_result_set.length;$2_6++){var $2_7=$p2_0[2].fql_result_set[$2_6];var $2_8=(JSFFScript._FFJS.$1[$2_7.uid1]);var $2_9=(JSFFScript._FFJS.$1[$2_7.uid2]);var $2_A={};$2_A.source=$2_9.index;$2_A.target=$2_8.index;$2_A.value=1;$1[$1.length]=$2_A;}var $2_0=960;var $2_1=500;var $2_2=d3.layout.force().charge(-120).linkDistance(30).size([$2_0,$2_1]);var $2_3=d3.select('#canvas').append('svg').attr('width',$2_0).attr('height',$2_1);$2_2.nodes($0).links($1).start();var $2_4=$2_3.selectAll('.link').data($1).enter().append('line').attr('class','link').style('stroke-width',function($p3_0){
return Math.sqrt($p3_0['value']);});var $2_5=$2_3.selectAll('.node').data($0).enter().append('circle').attr('class','node').attr('r',5).call($2_2.drag);$2_5.append('title').text(function($p3_0){
return $p3_0['name'];});$2_2.on('tick',function(){
$2_4.attr('x1',function($p4_0){
return ($p4_0['source'])['x'];}).attr('y1',function($p4_0){
return ($p4_0['source'])['y'];}).attr('x2',function($p4_0){
return ($p4_0['target'])['x'];}).attr('y1',function($p4_0){
return ($p4_0['target'])['y'];});$2_5.attr('cx',function($p4_0){
return $p4_0['x'];}).attr('cy',function($p4_0){
return $p4_0['y'];});});if(JSFFScript._FFJS.$2){alert(Object.getKeyCount(JSFFScript._FFJS.$1));}});});}
JSFFScript._FFJS.$5=function($p0){FB.logout(function(){
});}
JSFFScript._FFJS.$6=function(){$('#login').click(JSFFScript._FFJS.$3);$('#graph').click(JSFFScript._FFJS.$4);$('#LogoutButton').click(JSFFScript._FFJS.$5);var $0={};$0.appId='459808530803920';$0.channelUrl='http://localhost/channel.aspx';$0.status=true;$0.cookie=true;$0.xfbml=false;FB.init($0);FB.getLoginStatus(function($p1_0){
if($p1_0.status==='connected'){JSFFScript._FFJS.$0=$p1_0.authResponse.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+JSFFScript._FFJS.$0+'/picture';}});FB.Event.subscribe('auth.authResponseChange',function($p1_0){
if(JSFFScript._FFJS.$2){alert('Event Login Fired');}if($p1_0.status==='connected'){JSFFScript._FFJS.$0=$p1_0.authResponse.userID;(document.getElementById('image')).src='http://graph.facebook.com/'+JSFFScript._FFJS.$0+'/picture';}else{(document.getElementById('image')).src='';}});}
JSFFScript.Friend=function(_response,_index){this.name=_response.name;this.id=_response.id;this.index=_index;}
JSFFScript.Friend.prototype={name:null,id:null,index:0}
JSFFScript.Vector=function(X,Y){this.xCord=X;this.yCord=Y;}
JSFFScript.Vector.prototype={xCord:0,yCord:0,add:function(add){this.xCord+=add.xCord;this.yCord+=add.yCord;}}
JSFFScript.Point=function(){}
JSFFScript.Point.prototype={x:0,y:0,addVector:function(v){this.x+=parseInt(v.xCord);this.y+=parseInt(v.yCord);}}
JSFFScript._FFJS.registerClass('JSFFScript._FFJS');JSFFScript.Friend.registerClass('JSFFScript.Friend');JSFFScript.Vector.registerClass('JSFFScript.Vector');JSFFScript.Point.registerClass('JSFFScript.Point');JSFFScript._FFJS.$0=null;JSFFScript._FFJS.$1={};JSFFScript._FFJS.$2=false;(function(){$(JSFFScript._FFJS.$6);})();
})();// This script was generated using Script# v0.7.4.0
