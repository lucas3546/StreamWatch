using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Api.Infraestructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IGeoIpService _geo;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor, IGeoIpService geoIpService)
    {
        _httpContextAccessor = httpContextAccessor;
        _geo = geoIpService;
    }

    public string? Id =>
        _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
    public string? Name =>
        _httpContextAccessor.HttpContext?.User?.FindFirstValue(JwtRegisteredClaimNames.Name);
    public string? Role => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);
    public string? IpAddress => _httpContextAccessor?.HttpContext?.Connection?.RemoteIpAddress?.ToString();
    public string? ProfilePicUrl => _httpContextAccessor.HttpContext?.User?.FindFirstValue(JwtRegisteredClaimNames.Picture);
    public (string isoCode, string name) Country 
    {
        get
        {
            var ip = _httpContextAccessor?.HttpContext?.Connection?.RemoteIpAddress;

            if (ip == null)
                return ("Unknown", "Unknown");

            if (ip.IsIPv4MappedToIPv6)
                ip = ip.MapToIPv4();

            return _geo.GetCountry(ip.ToString());
        }
    }

}
