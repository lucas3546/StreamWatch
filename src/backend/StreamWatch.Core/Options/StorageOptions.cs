namespace StreamWatch.Core.Options;

public class StorageOptions
{
    public string Provider { get; set; } = "Local"; // "S3" or "Local"
    public string PublicUrl { get; set; } = "";
    public string BaseLocalPath { get; set; } = "";
    public S3StorageOptions S3 { get; set; } = new();
}
