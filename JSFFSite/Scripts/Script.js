/*! Script.js 1.0.0.0
 * 
 */

"use strict";

require(['ss', 'D3', 'Facebook', 'jquery'], function(ss, D3, Facebook, $) {
  var $global = this;

  // JSFFScript.FFJS

  function FFJS() {
  }
  FFJS.buttonClicked = function(e) {
    var options = {};
    options.scope = 'email, user_likes, publish_stream';
    FB.login(function(response) {
    }, options);
  };
  FFJS.graphFriends = function(e) {
    var nodes = [];
    var links = [];
    var options = {};
    FB.api('/me/friends', function(apiResponse) {
      for (var x = 0; x < (apiResponse.data).length; x++) {
        var friend = new Friend((apiResponse.data)[x], x);
        FFJS.friends[friend.id] = friend;
        var noeNode = new Node();
        noeNode.name = friend.name;
        noeNode.group = 1;
        nodes[nodes.length] = noeNode;
      }
      var q = {};
      q.friendsLimit = 'SELECT uid1, uid2 from friend WHERE uid1 = ' + FFJS.userID + ' ORDER BY uid2';
      q.friendsAll = 'SELECT uid1, uid2 from friend WHERE uid1 = ' + FFJS.userID;
      q.friendsoffriends = 'SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 from #friendsLimit) AND uid2 IN (SELECT uid2 from #friendsAll) AND uid1 < uid2';
      var queryOptions = {};
      queryOptions.method = 'fql.multiquery';
      queryOptions.queries = q;
      FB.api(queryOptions, function(queryResponse) {
        for (var i = 0; i < queryResponse[2].fql_result_set.length; i++) {
          var results = queryResponse[2].fql_result_set[i];
          var target = (FFJS.friends[results.uid1]);
          var origin = (FFJS.friends[results.uid2]);
          var newLink = new Link();
          newLink.source = origin.index;
          newLink.target = target.index;
          newLink.value = 1;
          links[links.length] = newLink;
        }
        var width = 960;
        var height = 500;
        var force = d3.layout.force().charge(-120).linkDistance(30).size([ width, height ]);
        var svg = d3.select('#canvas').append('svg').attr('width', width).attr('height', height);
        force.nodes(nodes).links(links).start();
        var link = svg.selectAll('.link').data(links).enter().append('line').attr('class', 'link').style('stroke-width', function(d) {
          return Math.sqrt(d['value']);
        });
        var node = svg.selectAll('.node').data(nodes).enter().append('circle').attr('class', 'node').attr('r', 5).call(force.drag);
        node.append('title').text(function(D) {
          return D['name'];
        });
        force.on('tick', function() {
          link.attr('x1', function(D) {
            return (D['source'])['x'];
          }).attr('y1', function(D) {
            return (D['source'])['y'];
          }).attr('x2', function(D) {
            return (D['target'])['x'];
          }).attr('y2', function(D) {
            return (D['target'])['y'];
          });
          node.attr('cx', function(D) {
            return D['x'];
          }).attr('cy', function(D) {
            return D['y'];
          });
        });
      });
    });
  };
  FFJS.logOut = function(e) {
    FB.logout(function(response) {
    });
  };
  FFJS.onload = function() {
    $('#login').click(FFJS.buttonClicked);
    $('#graph').click(FFJS.graphFriends);
    $('#LogoutButton').click(FFJS.logOut);
    var options = {};
    options.appId = '459808530803920';
    options.channelUrl = 'http://localhost/channel.aspx';
    options.status = true;
    options.cookie = true;
    options.xfbml = false;
    FB.init(options);
    FB.getLoginStatus(function(loginResponse) {
      if (loginResponse.status === 'connected') {
        FFJS.userID = loginResponse.authResponse.userID;
        (document.getElementById('image')).src = 'http://graph.facebook.com/' + FFJS.userID + '/picture';
      }
    });
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      if (response.status === 'connected') {
        FFJS.userID = response.authResponse.userID;
        (document.getElementById('image')).src = 'http://graph.facebook.com/' + FFJS.userID + '/picture';
      }
      else {
        (document.getElementById('image')).src = '';
      }
    });
  };


  // JSFFScript.Friend

  function Friend(_response, _index) {
    this.index = 0;
    this.name = _response.first_name + _response.last_name;
    this.id = _response.id;
    this.index = _index;
  }
  var Friend$ = {

  };


  var $exports = ss.module('Script',
    {
      FFJS: [ FFJS, null, null ]
    },
    {
      Friend: [ Friend, Friend$, null ]
    });

  FFJS.friends = {};
  FFJS.debug = false;
  $(FFJS.onload);

});
