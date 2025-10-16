using FFMpegCore;
using FFMpegCore.Pipes;
using Microsoft.AspNetCore.Http;
using NetVips;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Infraestructure.Services;

public class MediaProcessingService : IMediaProcessingService
{

    public async Task<Stream> GenerateThumbnailFromImageAsync(Stream input, bool isAnimated = false)
    {
        var options = new VOption { };

        if (isAnimated) options.Add("n", -1);
        
        var image = Image.NewFromStream(input, "", access: Enums.Access.Sequential, null, options);

        const int maxWidth = 600;

        if (image.Width > maxWidth)
        {
            image = image.ThumbnailImage(maxWidth);
        }



        var outputStream = new MemoryStream();

        image.WriteToStream(outputStream, ".webp");
        outputStream.Position = 0;
        image.Dispose();
        image.Dispose();

        return outputStream;
    }
    


    public async Task<Stream> GenerateThumbnailFromVideoUrlAsync(string videoUrl)
    {
        var ms = new MemoryStream();
        Uri uri = new Uri(videoUrl);

        await FFMpegArguments
            .FromUrlInput(uri)
            .OutputToPipe(
                new StreamPipeSink(ms),
                options =>
                    options
                        .Seek(TimeSpan.FromSeconds(1))
                        .Resize(600, 800)
                        .WithFrameOutputCount(1) 
                        .WithVideoCodec("libwebp")
                        .ForceFormat("webp")
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
            .OutputToPipe(
                new StreamPipeSink(outputStream),
                opt =>
                    opt.Seek(TimeSpan.FromSeconds(1))
                        .Resize(600, 800)
                        .WithFrameOutputCount(1)
                        .WithVideoCodec("libwebp")
                        .ForceFormat("webp")
            )
            .ProcessAsynchronously();

        outputStream.Position = 0;

        return outputStream;
    }
}
