namespace StreamWatch.Application.Common.Helpers;


public static class ContentTypeHelper
{
    private static readonly Dictionary<string, string> _mappings = new(StringComparer.OrdinalIgnoreCase)
    {
        { ".jpg",  "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".png",  "image/png" },
        { ".gif",  "image/gif" },
        { ".webp", "image/webp" },
        { ".svg",  "image/svg+xml" },

        { ".mp4",  "video/mp4" },
        { ".webm", "video/webm" },
        { ".ogg",  "video/ogg" },

        { ".mp3",  "audio/mpeg" },
        { ".wav",  "audio/wav" },
        { ".oga",  "audio/ogg" },

        { ".pdf",  "application/pdf" },
        { ".txt",  "text/plain" },
        { ".html", "text/html" },
        { ".json", "application/json" },
        { ".zip",  "application/zip" }
    };

    public static string GetContentType(string fileName)
    {
        var ext = Path.GetExtension(fileName);
        if (ext != null && _mappings.TryGetValue(ext, out var contentType))
        {
            return contentType;
        }

        return "application/octet-stream"; // default
    }

    public static bool IsVideo(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return false;

        var ext = Path.GetExtension(fileName);
        if (ext == null) return false;

        if (_mappings.TryGetValue(ext, out var contentType))
        {
            return contentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase);
        }

        return false;
    }
}
