using System;
using jQueryApi;
using System.Collections;
namespace JSFFScript
{
    interface IQueryEngine
    {
        IDeferred<Dictionary> RunQuery(Dictionary friends);
    }
}
