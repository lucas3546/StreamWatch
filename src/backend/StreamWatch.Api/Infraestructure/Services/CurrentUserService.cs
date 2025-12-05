using System.IdentityModel.Tokens.Jwt;
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
    public string? Role => _httpContextAccessor.HttpContext?.User?.FindFirstValue("role");
    public string? IpAddress => _httpContextAccessor?.HttpContext?.Connection?.RemoteIpAddress?.ToString();
    public string? ProfilePicUrl => _httpContextAccessor.HttpContext?.User?.FindFirstValue(JwtRegisteredClaimNames.Picture);
    public (string? isoCode, string? name) Country 
    {
        get
        {
            var ip = _httpContextAccessor?.HttpContext?.Connection?.RemoteIpAddress?.ToString();

            if (string.IsNullOrWhiteSpace(ip) || ip == "127.0.0.1" || ip == "::1")
                return (null, null);

            return _geo.GetCountry(ip);
        }
    }
}
