using System;
using Redis.OM.Modeling;

namespace StreamWatch.Core.Cache;

public class PlaylistVideoItem
{
    public PlaylistVideoItem()
    {
        Id = Guid.NewGuid().ToString();
    }
    public PlaylistVideoItem(string videoUrl, string videoTitle, string thumbnailUrl, string provider, string accountId, string userName)
    {
        Id = Guid.NewGuid().ToString();
        VideoUrl = videoUrl;
        VideoTitle = videoTitle;
        ThumbnailUrl = thumbnailUrl;
        Provider = provider;
        AccountId = accountId;
        UserName = userName;
    }
    [Indexed]
    public string Id { get; set; }
    [Indexed]
    public string VideoUrl { get; set; }
    [Indexed]
    public string VideoTitle { get; set; }
    [Indexed]
    public string ThumbnailUrl { get; set; }
    [Indexed]
    public string Provider { get; set; }
    [Indexed]
    public string AccountId { get; set; }
    [Indexed]
    public string UserName { get; set; }
    [Indexed(Sortable = true)]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}