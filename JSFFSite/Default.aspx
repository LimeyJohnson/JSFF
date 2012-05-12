<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="JSFFSite.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
   
    
    <title>Friends Graph</title>
</head>
<body>
    <form id="form1" runat="server">
    <div id="fb-root"> 
    </div>
    <div class="fb-login-button"></div>
    <button id="MyButton" title="Clickme">Something</button>
    </form>
     <script type="text/javascript" src="http://connect.facebook.net/en_US/all.js" ></script>
    <script type="text/javascript" src="Scripts/jquery-1.4.1.js"></script>
    <script type="text/javascript" src="Scripts/mscorlib.js"></script>
    <script type="text/javascript" src="Scripts/JSFFScript.debug.js"></script>
</body>
</html>
