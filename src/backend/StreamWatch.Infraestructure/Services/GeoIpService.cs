using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.Runtime.Internal.Util;
using MaxMind.GeoIP2;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Infraestructure.Services
{
    public class GeoIpService : IGeoIpService
    {
        private readonly DatabaseReader _reader;

        public GeoIpService(DatabaseReader reader)
        {
            _reader = reader;
        }

        public (string isoCode, string name) GetCountry(string ipAddress)
        {
            try
            {
                var country = _reader.Country(ipAddress);

                return (country.Country?.IsoCode ?? "Unknown", country.Country?.Name ?? "Unknown");
            }
            catch
            {
                return ("Unknown", "Unknown");
            }
            
        }
    }

}