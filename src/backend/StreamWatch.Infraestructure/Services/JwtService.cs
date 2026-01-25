using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Identity;

namespace StreamWatch.Infraestructure.Services;

public class JwtService : IJwtService
{
    public IConfiguration _config;
    public JwtService(IConfiguration config)
    {
        _config = config;
    }
    public string GenerateToken(List<Claim> claimsForToken, DateTime ExpirationTime)
    {
        string? jwtKey = _config["JWT:Key"];

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenKey = Encoding.UTF8.GetBytes(jwtKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claimsForToken),
            Expires = ExpirationTime,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    public List<Claim> GetClaimsForUser(Account account, string? profilePicName, string roleName, string countryCode, string countryName)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, account.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(
                JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64
            ),
            new Claim(JwtRegisteredClaimNames.Iss, _config["JWT:Issuer"]),
            new Claim(JwtRegisteredClaimNames.Aud, _config["JWT:Audience"]),

            new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Name, account.UserName),
            new Claim(JwtRegisteredClaimNames.Email, account.Email),
            new Claim("countryCode", countryCode),
            new Claim("countryName", countryName),
            new Claim(ClaimTypes.Role, roleName)
        };

        if (!string.IsNullOrWhiteSpace(profilePicName))
        {
            claims.Add(new Claim(JwtRegisteredClaimNames.Picture, profilePicName));
        }
        return claims;
    }
}