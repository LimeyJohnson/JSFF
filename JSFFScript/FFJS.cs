// Class1.cs
//

using System;
using System.Collections.Generic;
using System.Html;
using FacebookLibrary;
namespace JSFFScript
{

    internal static class FFJS
    {

        static FFJS()
        {
            InitOptions options = new InitOptions();
            options.appId = "Somethings";
            options.cookie = false;
            
            Window.AddEventListener("load", delegate(ElementEvent e)
            {
                Facebook.init(options);
                
            }, /* useCapture */ false);
        }
    }
}
