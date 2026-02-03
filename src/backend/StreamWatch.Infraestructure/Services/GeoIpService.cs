using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.Runtime.Internal.Util;
using MaxMind.GeoIP2;
using Microsoft.Extensions.Logging;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Infraestructure.Services
{
    public class GeoIpService : IGeoIpService
    {
        private readonly DatabaseReader _reader;
        private readonly ILogger<GeoIpService> _logger;
        public GeoIpService(DatabaseReader reader, ILogger<GeoIpService> logger)
        {
            _reader = reader;
            _logger = logger;
        }

        public (string isoCode, string name) GetCountry(string ipAddress)
        {
            try
            {
                var country = _reader.Country(ipAddress);

                return (country.Country?.IsoCode ?? "Unknown", country.Country?.Name ?? "Unknown");
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error trying to get the country ");

                return ("Unknown", "Unknown");
            }
            
        }
    }

}