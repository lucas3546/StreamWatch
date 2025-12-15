using System;

namespace StreamWatch.Api.Infraestructure.Models;

public record RoomMessageModel
{
    public RoomMessageModel(bool isNotification, string text)
    {
        Id = Guid.NewGuid().ToString();
        IsNotification = isNotification;
        Text = text;

    }
    public string Id {get; init;}
    public bool IsNotification {get; init;}
    public string Text {get; init;}
}
