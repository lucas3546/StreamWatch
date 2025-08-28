using FFMpegCore;
using FFMpegCore.Pipes;
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
    
    public async Task<Stream> GenerateThumbnailStreamAsync(string videoUrl)
    {
        var ms = new MemoryStream();
        Uri uri = new Uri(videoUrl);
        
        await FFMpegArguments
            .FromUrlInput(uri)
            .OutputToPipe(new StreamPipeSink(ms), options => options
                    .WithFrameOutputCount(1) // un solo frame
                    .ForceFormat("webp")    // formato WEBP
            )
            .ProcessAsynchronously();

        ms.Position = 0;
        return ms;
    }

    
    public async Task<Stream> GenerateThumbnailFromFileAsync(string filePath)
    {
        if (!File.Exists(filePath))
            throw new FileNotFoundException("Video file not found", filePath);

        var outputStream = new MemoryStream();

        await FFMpegArguments
            .FromFileInput(filePath, verifyExists: true)
            .OutputToPipe(new StreamPipeSink(outputStream), opt => opt
                .Seek(TimeSpan.FromSeconds(1))   
                .Resize(600, 800)                
                .WithFrameOutputCount(1)         
                .WithVideoCodec("libwebp")       
                .ForceFormat("webp"))           
            .ProcessAsynchronously();

        outputStream.Position = 0;
        
        return outputStream;
    }

}