using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace StreamWatch.Application.Common.Helpers
{
    public static class SupportedImageFormats
    {
        public static readonly HashSet<string> Values = new(StringComparer.OrdinalIgnoreCase)
        {
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/avif"
        };
    }
}
