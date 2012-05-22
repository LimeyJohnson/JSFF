// Class1.cs
//

using System;
using System.Html;
using System.Runtime.CompilerServices;
using System.Collections;
using FreindsLibrary;
using System.Html.Media.Graphics;
using jQueryApi;
namespace JSFFScript
{
    public sealed class Friend
    {
        public Friend(FriendInfo _response, CanvasContext2D _canvasContext, double _x, double _y)
        {
            this.name = _response.name;
            this.id = _response.id;
            this.canvasContext = _canvasContext;
            this.x = _x;
            this.y = _y;
            this.connections = new ArrayList();
            ImageElement image = (ImageElement)Document.CreateElement("img");
            image.Src = "http://graph.facebook.com/" + id + "/picture";
            image.ID = this.imageid;
            image.Style.Visibility = "hidden";
            Document.GetElementById("images").InsertBefore(image);
            jQuery.Select("#" + this.imageid).One("load", new jQueryEventHandler(drawLoadImage));
        }
        CanvasContext2D canvasContext;
        public string name;
        public double x;
        public double y;
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
        public void highlightPrimary()
        {
            canvasContext.FillStyle = "red";
            canvasContext.FillRect(x - FFJS.imageOffSet, y - FFJS.imageOffSet, FFJS.imageOffSet*2 + FFJS.imagesize, FFJS.imageOffSet*2 + FFJS.imagesize);
            this.drawImage();
        }
        public void highlightSecondary()
        {
            canvasContext.FillStyle = "green";
            canvasContext.FillRect(x - FFJS.imageOffSet, y - FFJS.imageOffSet, FFJS.imageOffSet*2 + FFJS.imagesize, FFJS.imageOffSet*2 + FFJS.imagesize);
            this.drawImage();
        }
        public void drawLoadImage(jQueryEvent e)
        {
            this.drawImage();
        }
        public void drawImage()
        {
            canvasContext.DrawImage(GetImageElement, x, y, FFJS.imagesize, FFJS.imagesize);
        }
    }
}


