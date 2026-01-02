using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StreamWatch.Core.Errors
{
    public class UnexpectedError : BaseError
    {
        public UnexpectedError(string message) : base(message)
        {
            
        }
    }
}