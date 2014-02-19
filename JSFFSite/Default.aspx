<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="JSFFSite.Default" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <title>Friends Graph</title>
</head>
<body>
    <link href="Styles/JSFFStyle.css" rel="stylesheet" />
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
                    exports: "$"
                }

            }

        });
    </script>
    <script src="Scripts/Script.js"></script>
    <div class="fb-login-button">
    </div>
    <div id="fb-root">
        
    </div>
    charge <input id="charge" type="text" />
    distance <input id="distance" type="text" />
    <button id="login" title="Clickme">
        LogIn</button>
    <button id="graph" title="Clickme">
        GraphIt</button>
    <div id="canvas"></div>
    <div id="callout"></div>
</body>
</html>
