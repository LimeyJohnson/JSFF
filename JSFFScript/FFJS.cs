// Class1.cs
//

using System;
using System.Collections.Generic;
using System.Html;
using FriendsLibrary;
namespace JSFFScript
{

    internal static class FFJS
    {
        static FFJS()
        {
        
            InitOptions options = new InitOptions();
            options.appId = "240082229369859";
            options.cookie = true;
            options.xfbml = false;
            options.channelUrl = "http://limeyhouse.dyndns.org/channel.aspx";
            options.status = false;

            Facebook.init(options);
            InputElement button = (InputElement)Document.GetElementById("MyButton");
            Button b = new Button(Document.GetElementById("MyButton");
        }
        public static void ButtonClicked(object sender, EventArgs e)
        {
            Script.Alert("this worked");
        }
    }
}
