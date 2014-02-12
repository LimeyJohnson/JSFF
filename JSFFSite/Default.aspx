<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="JSFFSite.Default" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <title>Friends Graph</title>
</head>
<body>
   <style>

.node {
  stroke: #fff;
  stroke-width: 1.5px;
}

.link {
  stroke: #999;
  stroke-opacity: .6;
}

</style>
    <script src="Scripts/require.js"></script>
    <script type="text/javascript">
        require.config({
            baseUrl: '/scripts',
            paths: {
                d3: "http://d3js.org/d3.v3.min",
                Facebook: "//connect.facebook.net/en_US/all"
            },
            shim: {
                d3: {
                    exports: "d3",
                },
                Facebook: {
                    exports: "FB"
                },
                jquery: {
                    exports:"$"
                }
                
            }

        });
    </script>
    <script src="Scripts/Script.js"></script>
    <img id="image" alt="Profile Pic" width="100", height="100" />
    <div class="fb-login-button">
    </div>
    <div id="fb-root">
    </div>
    <button id="login" title="Clickme">
        LogIn</button>
    <button id="graph" title="Clickme">
       GraphIt</button>
       <button id="Iterate" title="Clickme">
        Iterate</button>
    <button id="LogoutButton" title="Clickme">
        Logout</button>
        <label id="friendName"></label>
    <div id="resultsDiv">
    </div>
    <div id="canvas"></div>
    </body>
</html>
