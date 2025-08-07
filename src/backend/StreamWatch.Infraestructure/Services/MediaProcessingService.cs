using Microsoft.AspNetCore.Http;
using NetVips;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Infraestructure.Services;

public class MediaProcessingService : IMediaProcessingService
{ 
    public Stream ResizeImage(Stream inputStream, int width, int height, string format = "webp")
    {
        var image = Image.NewFromStream(inputStream, "", access: Enums.Access.Sequential);

        var resized = image.ThumbnailImage(width, height: height);
        
        var outputStream = new MemoryStream();
        var outputBytes = resized.WriteToBuffer($".{format}");
        outputStream.Write(outputBytes);
        outputStream.Position = 0;

        image.Dispose();
        resized.Dispose();
        
        return outputStream;
    }
    
    public Stream ConvertImageFormat(Stream inputStream, string format = "webp")
    {
        var image = Image.NewFromStream(inputStream, "", access: Enums.Access.Sequential);

        var outputStream = new MemoryStream();
        var outputBytes = image.WriteToBuffer($".{format}");
        outputStream.Write(outputBytes);
        outputStream.Position = 0;

        image.Dispose();
        
        return outputStream;
    }

}