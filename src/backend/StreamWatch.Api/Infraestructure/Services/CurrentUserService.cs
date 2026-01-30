using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Api.Infraestructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IGeoIpService _geo;
    private readonly ILogger<CurrentUserService> _logger;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor, IGeoIpService geoIpService, ILogger<CurrentUserService> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _geo = geoIpService;
        _logger = logger;
    }

    public string? Id =>
        _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
    public string? Name =>
        _httpContextAccessor.HttpContext?.User?.FindFirstValue(JwtRegisteredClaimNames.Name);
    public string? Role => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);
    public string? IpAddress 
    {
        get
        {
            var context = _httpContextAccessor?.HttpContext;
            if (context == null) return null;

            var cfIp = context.Request.Headers["CF-Connecting-IP"].FirstOrDefault();
            if (!string.IsNullOrEmpty(cfIp))
                return cfIp;
            
            var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
            if (!string.IsNullOrEmpty(realIp))
                return realIp;
            
            var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedFor))
            {
                var ips = forwardedFor.Split(',', StringSplitOptions.RemoveEmptyEntries);
                return ips.FirstOrDefault()?.Trim();
            }
            
            var remoteIp = context.Connection.RemoteIpAddress?.MapToIPv4().ToString();
            
            
            return remoteIp;
        }
    }
    public string? ProfilePicUrl => _httpContextAccessor.HttpContext?.User?.FindFirstValue(JwtRegisteredClaimNames.Picture);
    public (string isoCode, string name) Country 
    {
        get
        {
            var ip = this.IpAddress;

            _logger.LogInformation("IpAddress:{ip}", ip);

            if (ip == null)
                return ("Unknown", "Unknown");

            _logger.LogInformation("test");
            
            return _geo.GetCountry(ip.ToString());
        }
    }

}
