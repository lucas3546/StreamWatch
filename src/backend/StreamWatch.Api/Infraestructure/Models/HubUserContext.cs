using System;

namespace StreamWatch.Api.Infraestructure.Models;

public record HubUserContext(
    string Id,
    string UserName,
    string? ProfilePic,
    string ConnectionId
);