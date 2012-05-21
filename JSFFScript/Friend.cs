// Class1.cs
//

using System;
using System.Html;
using System.Runtime.CompilerServices;
using System.Collections;
using FreindsLibrary;
using System.Html.Media.Graphics;
namespace JSFFScript
{
    public sealed class Friend
    {
        public Friend(FriendInfo _response, CanvasContext2D _canvasContext)
        {
            this.name = _response.name;
            this.id = _response.id;
            this.canvasContext = _canvasContext;
            this.connections = new ArrayList();
            ImageElement image = (ImageElement)Document.CreateElement("img");
            image.Src = "http://graph.facebook.com/" + id + "/picture";
            image.ID = this.imageid;
            image.Style.Visibility = "hidden";
            Document.GetElementById("images").InsertBefore(image);
        }
        CanvasContext2D canvasContext;
        public string name;
        public string id;
        public ArrayList connections;
        public string imageid
        {
            get
            {
                return "image" + this.id;
            }
        }
        public ImageElement GetImageElement
        {
            get
            {
                return Document.GetElementById(imageid).As<ImageElement>();
            }
        }
        
        public void drawImage(double _x, double _y)
        {
           
            canvasContext.DrawImage(GetImageElement, _x, _y);
        }
    }
}


