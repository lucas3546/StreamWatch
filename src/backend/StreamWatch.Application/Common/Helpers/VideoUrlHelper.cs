namespace StreamWatch.Application.Common.Helpers;

using System.Text.RegularExpressions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

public static class VideoUrlHelper
{
    private static readonly HttpClient _http = new HttpClient();
    private static readonly Dictionary<string, Regex> Platforms = new()
    {
        { "YouTube", new Regex(@"(youtube\.com|youtu\.be)", RegexOptions.IgnoreCase | RegexOptions.Compiled) },
        { "Vimeo",   new Regex(@"vimeo\.com", RegexOptions.IgnoreCase | RegexOptions.Compiled) },
        { "Twitch",  new Regex(@"twitch\.tv", RegexOptions.IgnoreCase | RegexOptions.Compiled) }
    };


    public static string? GetPlatform(string url)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;

        foreach (var kv in Platforms)
        {
            if (kv.Value.IsMatch(url))
                return kv.Key;
        }

        return null;
    }


    public static string? GetVideoId(string url)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;

        var platform = GetPlatform(url);
        if (platform == null) return null;

        return platform switch
        {
            "YouTube" => ExtractYouTubeId(url),
            _ => null
        };
    }

    public static async Task<string?> GetVideoTitleAsync(string url)
    {
        var html = await _http.GetStringAsync(url);

        var match = Regex.Match(html, @"<title>(.*?)</title>", RegexOptions.Singleline);
        if (match.Success)
        {
            var rawTitle = match.Groups[1].Value;
            return rawTitle.Replace(" - YouTube", "").Trim();
        }

        return null;
    }

    public static string? GetThumbnailUrl(string url)
    {
        var platform = GetPlatform(url);
        if (platform == null) return null;

        var videoId = GetVideoId(url);
        if (string.IsNullOrEmpty(videoId)) return null;

        return platform switch
        {
            "YouTube" => $"https://img.youtube.com/vi/{videoId}/hqdefault.jpg",
            _ => null
        };
    }

    public static bool IsSupported(string url) => GetPlatform(url) != null;
    
    private static string? ExtractYouTubeId(string url)
    {
        try
        {
            var uri = new Uri(url);

            // Caso: youtube.com/watch?v=VIDEOID
            var query = HttpUtility.ParseQueryString(uri.Query);
            if (query.AllKeys.Contains("v"))
                return query["v"];

            // Caso: youtu.be/VIDEOID
            var shortMatch = Regex.Match(url, @"youtu\.be\/([a-zA-Z0-9_-]{11})");
            if (shortMatch.Success)
                return shortMatch.Groups[1].Value;
            
        }
        catch
        {
            return null;
        }

        return null;
    }

}
