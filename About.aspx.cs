using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class About : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string player = Request.QueryString["player"];
        if (String.IsNullOrEmpty(player)) player = "Walcott";
        SqlConnectionStringBuilder Scsb = new SqlConnectionStringBuilder();
        Scsb.UserID = "Limey@zwcag9dp75.database.windows.net";
        Scsb.Password = "Xi4cuiP3";
        Scsb.InitialCatalog = "EPL";
        Scsb.TrustServerCertificate = true;
        Scsb.DataSource = "zwcag9dp75.database.windows.net";
        Scsb.Encrypt = false;

        SqlConnection MyConnection = new SqlConnection(Scsb.ToString());
        SqlCommand myCommand = MyConnection.CreateCommand();
        myCommand.CommandText = "SELECT GameWeek, Total from PlayerGame INNER JOIN Games on Games.ID = PlayerGame.Game WHERE PlayerGame.Player IN(Select ID FROM Players WHERE LastName = '" + player + "')";
        MyConnection.Open();
        SqlDataReader reader = myCommand.ExecuteReader();
        if (reader.HasRows)
        {
            string responseText = "{ \"cols\": [{\"id\":\"GameWeek\" , \"label\":\"GameWeek\", \"type\":\"string\"},\n{\"id\":\"Total\" , \"label\":\"Total\", \"type\":\"number\"} ], \n\"rows\": [";
            while (reader.Read())
            {
                responseText += "{\"c\":[{\"v\": \"" + reader["GameWeek"] + "\"}, {\"v\":" + reader["Total"] + "}]},";
            }
            MyConnection.Close();
            responseText = responseText.Remove(responseText.Length - 1);
            responseText += "]}";
            Response.Write(responseText);
        }
        else
        {
            Response.Write("{ \"Error\": \"No Rows Returned\"}");
        }
    }
}
