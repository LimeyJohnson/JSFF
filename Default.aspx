<%@ Page Title="Home Page" Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs"
    Inherits="_Default" %>

<html>
<head>
    <title>My Site</title>
    <script type="text/javascript" src="Scripts/jquery-1.4.1.js"></script>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">

        // Load the Visualization API and the piechart package.
        google.load('visualization', '1', { 'packages': ['corechart'] });
    </script>
</head>
<body>
    <select name="PlayerSelect" id="PlayerSelect" size="4" multiple="true" runat="server">
    </select>
    <input type="button" value="Get Totals" onclick="drawChart();" />
    <div id="chart_div">
    </div>
    <script type="text/javascript">
        function drawChart() {
            //clear the screen
            $(chart_div).html('');
            var requestnames = $(PlayerSelect).val();
            var request;
            request = requestnames[0];
            for (var x=1; x<requestnames.length; x=x+1) {
                request += "," + x;
            }
            if (text.length > 0) {
                try {
                    var jsonData = $.ajax({
                        url: "About.aspx",
                        dataType: "json",
                        data: 'players=' + request,
                        async: false
                    }).responseText;
                    var response = $.parseJSON(jsonData);
                    if (response.Error) {
                        $(chart_div).html(response.Error);
                    }
                    else {
                        // Create our data table out of JSON data loaded from server.
                        var data = new google.visualization.DataTable(jsonData);
                        var options = {
                            title: text,
                            hAxis: { title: 'Game Week' },
                            vAxis: { title: 'Points' },
                            height: 500,
                            width: 1000
                        };
                        // Instantiate and draw our chart, passing in some options.
                        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
                        chart.draw(data, options);
                    }
                }
                catch (err) {
                    $(chart_div).html("Error");
                }
            }
        }
        function requestFailed(jqXHR, textStatus) {

        }
    </script>
</body>
</html>
