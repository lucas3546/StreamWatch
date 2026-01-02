using System;

namespace StreamWatch.Application.Common.Models;

public record RoomMessageModel
{
    public RoomMessageModel(
        bool isNotification, 
        string text,
        string? userName = null,
        string? countryCode = null,
        string? countryName = null,
        string? image = null,
        string? userId = null,
        string? replyToMessageId = null,
        bool isWhisper = false)
    {
        Id = Guid.NewGuid().ToString();
        UserId = userId;
        UserName = userName;
        IsNotification = isNotification;
        Text = text;
        CountryCode = countryCode;
        CountryName = countryName;
        Image = image;
        ReplyToMessageId = replyToMessageId;
        IsWhisper = isWhisper;
        
    }
    public string Id {get; init;}
    public string? UserName {get; init; }
    public string? CountryCode {get; init; }
    public string? CountryName {get; init; }
    public string Text {get; init;}
    public string? Image {get; init;}
    public string? UserId {get; init;}
    public string? ReplyToMessageId {get; init;}
    public bool IsNotification {get; init;}
    public bool IsWhisper {get; init;}
    
}
