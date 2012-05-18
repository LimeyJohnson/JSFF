<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="JSFFSite.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
   
    
    <title>Friends Graph</title>
</head>
<body>


    <form id="form1" runat="server">
    <img id="image" alt="Profile Pic" width="100", height="100"/>
    <div class="fb-login-button"></div>
    <div id="fb-root"></div>
<script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script>
<script type="text/javascript">
    FB.init({
        appId: '240082229369859', // App ID
        channelUrl: '//limeyhouse.dyndns.org/channel.aspx', // Channel File
        status: false, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true  // parse XFBML
    });
</script> 
    <button id="MyButton" title="Clickme">LogIn</button>
    <button id="PostButton" title="Clickme">FriendConnectionCount</button>
    <button id="LogoutButton" title="Clickme">Logout</button>
    <div id="resultsDiv">Results Here</div>
    </form>
    <script type="text/javascript" src="Scripts/jquery-1.4.1.js"></script>
    <script type="text/javascript" src="Scripts/mscorlib.js"></script>
    <script type="text/javascript" src="Scripts/JSFFScript.debug.js"></script>
    
</body>
</html>
