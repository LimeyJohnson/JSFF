// Class1.cs
//

using System;
using System.Html;
using System.Runtime.CompilerServices;
using System.Collections;
namespace FriendsLibrary
{

        [Imported]
        [IgnoreNamespace]
        [ScriptName("FB")]
        public static class Facebook
        {
            public delegate void ApiDelegate(ApiResponse response);
            public delegate void QueryDelgate(QueryResponse[] response);
            public delegate void LoginDelegate(LoginResponse response);
            public delegate void LogoutDelegate();
            public static void init(InitOptions options){}
            public static void api(string apiCall, ApiDelegate response) { }
            public static void api(string apiCall, string noun, ApiOptions options, ApiDelegate response) { }
            public static void api(ApiOptions options, QueryDelgate response) { }
            public static void login(LoginDelegate d) { }
            public static void login(LoginDelegate d, LoginOptions options) { }
            public static void logout(LogoutDelegate d) { }
            public static void getLoginStatus(LoginDelegate response) { }
        }
        [Imported, IgnoreNamespace, ScriptName("Object")]
        public sealed class InitOptions
        {
            public string appId;
            public string channelUrl;
            public bool status;
            public bool cookie;
            public bool xfbml;
        }
    public sealed class LoginResponse
    {
        public AuthResponse authResponse;
        public string status;

    }
    public class AuthResponse
    {
        public string userID;
        public string accessToken;
    }
    [Imported, IgnoreNamespace, ScriptName("Object")]
    public sealed class LoginOptions
    {
        public string scope;
    }
     [Imported, IgnoreNamespace, ScriptName("Object")]
    public sealed class ApiOptions
    {
        public string message;
        public string method;
        public Queries queries;
    }
    [Imported, IgnoreNamespace, ScriptName("Object")]
     public sealed class Queries
     {
          public string friendsAll;
         public string friendsLimit;
         public string friendsoffriends;
     }
    public sealed class ApiResponse
    {
        public string name;
        public string id;
        public string error;
        public Friend[] data;
    }
    [Imported, IgnoreNamespace, ScriptName("Object")]
    public sealed class QueryResponse
    {
        public MultiQueryResults[] fql_result_set;
    }
    [Imported, IgnoreNamespace, ScriptName("Object")]
    public sealed class MultiQueryResults
    {
        public string uid1;
        public string uid2;
    }
    [Imported, IgnoreNamespace, ScriptName("Object")]
    public sealed class Friend
    {
        public string name;
        public string id;
        public string[] connections;
    }
       
        //[Imported]
        //[IgnoreNamespace]
        //internal sealed class PhotoCollection : Record {

        //    public Photo[] photo = null;
        //}

        //[Imported]
        //[IgnoreNamespace]
        //internal sealed class PhotoSearchResponse : Record {

        //    public PhotoCollection photos = null;
        //}

        //public interface IPhotoService {

        //    void SearchPhotos(string tags, int count, FlickrSearchCallback callback);
        //}

        //public sealed class FlickrService : IPhotoService {

        //    private const string FlickrSearchURLFormat =
        //        "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=be9b6f66bd7a1c0c0f1465a1b7e8a764&tags={0}&per_page={1}&sort=interestingness-desc&safe_search=1&content_type=1&in_gallery=true&extras=o_dims%2Curl_sq%2Curl_m&format=json&jsoncallback={2}";

        //    public void SearchPhotos(string tags, int count, FlickrSearchCallback callback) {
        //        FlickrCallback requestCallback = delegate(PhotoSearchResponse response) {
        //            callback(response.photos.photo);
        //        };
        //        string callbackName = Delegate.CreateExport(requestCallback);

        //        string url = String.Format(FlickrSearchURLFormat, tags.EncodeUriComponent(), count, callbackName);
        //        ScriptElement script = (ScriptElement)Document.CreateElement("script");
        //        script.Type = "text/javascript";
        //        script.Src = url;
        //        Document.GetElementsByTagName("head")[0].AppendChild(script);
        //    }
        //}

        //internal delegate void FlickrCallback(PhotoSearchResponse response);

        
    }


