using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
        SqlConnectionStringBuilder Scsb = new SqlConnectionStringBuilder();
        Scsb.UserID = "Limey@zwcag9dp75.database.windows.net";
        Scsb.Password = "Xi4cuiP3";
        Scsb.InitialCatalog = "EPL";
        Scsb.TrustServerCertificate = true;
        Scsb.DataSource = "zwcag9dp75.database.windows.net";
        Scsb.Encrypt = false;

        SqlConnection MyConnection = new SqlConnection(Scsb.ToString());
        SqlCommand myCommand = MyConnection.CreateCommand();
        myCommand.CommandText = "SELECT LastName, ID FROM Players";
        MyConnection.Open();
       SqlDataReader reader = myCommand.ExecuteReader();
        while(reader.Read())
        {
            PlayerSelect.Items.Add(new ListItem(reader["LastName"].ToString(), reader["id"].ToString()));
        }
    }
}
