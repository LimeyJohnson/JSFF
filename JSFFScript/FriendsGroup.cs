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
    public sealed class FriendsGroup
    {
        public Dictionary Friends;
        public double RepulsionConstant = 0.01;
        public double AttractionConstant = 0.01;
        public int VertexCount;
        public FriendsGroup(Dictionary _Friends)
        {
            this.Friends = _Friends;
            this.VertexCount = _Friends.Keys.Length;
        }
        private Vector RepelForce(Friend target, Friend actor)
        {
            double distance = getDistance(target.X, target.Y, actor.X, actor.Y);
            double xUnit = (target.X - actor.X) / distance;
            double yUnit = (target.Y - actor.Y) / distance;
            Vector result = new Vector();
            result.xCord = xUnit / (RepulsionConstant * distance * distance);
            result.yCord = yUnit / (RepulsionConstant * distance * distance);
            return result;
        }
        private Vector AttractForce(Friend target, Friend actor)
        {
            Vector result = new Vector();
            result.xCord = AttractionConstant * (actor.X - target.X);
            result.yCord = AttractionConstant * (actor.Y - target.Y);
            return result;
        }
        private double getDistance(double x1, double y1, double x2, double y2)
        {
            double result = Math.Sqrt(Math.Pow(x2 - x1, 2) + Math.Pow(y2, y1));
            return result;
        }
        public void iterate()
        {
            for (int x = 0; x < Friends.Keys.Length; x++)
            {
                iterateSingle(Friends.Keys[x]);
            }

        }
        public void iterateSingle(string id)
        {
            Friend f = (Friend)Friends[id];
            Vector netForce = new Vector();
            for (int y = 0; y < Friends.Keys.Length; y++)
            {
                Friend b = (Friend)Friends[Friends.Keys[y]];
                if (f.id != b.id)
                {
                    if (f.connections.Contains(b.id)) netForce.Add(AttractForce(f, b));
                    else netForce.Add(RepelForce(f, b));
                }
            }
            f.X = f.X + (int)netForce.xCord;
            f.Y = f.Y + (int)netForce.yCord;
        }
    }
    public sealed class Vector
    {
        public double xCord;
        public double yCord;
        public Vector() { }
        public Vector(double X, double Y)
        {
            this.xCord = X;
            this.yCord = Y;
        }
        public void Add(Vector add)
        {
            this.xCord += add.xCord;
            this.yCord += add.yCord;
        }
    }
    public sealed class Point
    {
        public int X;
        public int Y;
        public void AddVector(Vector v)
        {
            this.X += (int)v.xCord;
            this.Y += (int)v.yCord;
        }
    }

}


