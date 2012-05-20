// Class1.cs
//

using System;
using System.Html;
using System.Runtime.CompilerServices;
using System.Collections;
using FreindsLibrary;
namespace JSFFScript
{
    public sealed class Friend
    {
        public Friend(FriendInfo response)
        {
             this.name = response.name;
            this.id = response.id;
            this.connections = new ArrayList();
        }
        public string name;
        public string id;
        public ArrayList connections;
        public int x;
            public int y;
        public string imagetag
        {
            get
            {
                return "<img id=\"image\" src=\"http://graph.facebook.com/" + id + "/picture\" alt=\"" + name + "\" width=\"100\", height=\"100\"/>";
            }
        }
    }
}


