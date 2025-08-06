namespace StreamWatch.Core.Options;

public class S3StorageOptions
{
    public string AccessKey { get; set; } = "";
    public string SecretKey { get; set; } = "";
    public string ServiceURL { get; set; } = "";
    public string Bucket { get; set; } = "";
}