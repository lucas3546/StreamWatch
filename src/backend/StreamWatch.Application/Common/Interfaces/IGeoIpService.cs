using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StreamWatch.Application.Common.Interfaces
{
    public interface IGeoIpService
    {
        public (string isoCode, string name) GetCountry(string ipAddress);
    }
}