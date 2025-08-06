using Microsoft.AspNetCore.Http;

namespace StreamWatch.Application.Requests;

public record UpdateProfilePicRequest
{
    public IFormFile Picture {get; init;}
}