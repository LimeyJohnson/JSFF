// Class1.cs
//

using System;
using System.Collections.Generic;
using System.Html;
using FriendsLibrary;
using jQueryApi;
namespace JSFFScript
{

    internal static class FFJS
    {
        static FFJS()
        {
            jQuery.OnDocumentReady(new Action(Onload));
        }
        public static void ButtonClicked(jQueryEvent e)
        {
            Script.Alert("About to Log in");
            LoginOptions options = new LoginOptions();
            options.scope = "email, user_likes, publish_stream";
            Facebook.login(delegate(LoginResponse response)
            {
                if (response.authResponse)
                {
                    Script.Alert("Logged in");

                    Facebook.api("/me", delegate(ApiResponse apiResponse)
                    {
                        Script.Alert("Good to see you" + apiResponse.name);
                        ((ImageElement)Document.GetElementById("image")).Src = "http://graph.facebook.com/" + apiResponse.id + "/picture";
                    });
                }
                else
                {
                    Script.Alert("Not Logged in ");
                }
            }, options
                );
        }
        public static void Post(jQueryEvent e)
        {
            ApiOptions options = new ApiOptions();
            options.message = "Gig'EM";
            Facebook.api("/me/feed", "post", options, delegate(ApiResponse apiResponse)
            {
                if (Script.IsNull(apiResponse) || !Script.IsNullOrUndefined(apiResponse.error))
                {
                    Script.Alert("error occured");
                }
                else
                {
                    Script.Alert("Posted correctly");
                }
            });
        }
        public static void Onload()
        {
            InitOptions options = new InitOptions();
            options.appId = "240082229369859";
            options.cookie = true;
            options.xfbml = false;
            options.channelUrl = "limeyhouse.dyndns.org/channel.aspx";
            options.status = false;

            Facebook.init(options);
            jQuery.Select("#MyButton").Click(new jQueryEventHandler(ButtonClicked));
            jQuery.Select("#PostButton").Click(new jQueryEventHandler(Post));
        }
    }
}
