namespace StreamWatch.Core.Options;

public class S3StorageOptions
{
    public string AccessKey { get; set; } = "";
    public string SecretKey { get; set; } = "";
    public string ServiceURL { get; set; } = "";
    public string PublicBucket { get; set; } = "";
    public string PublicBaseUrl { get; set; } = "";
    public int LimitUsagePerUser {get; set;} = 0; //
}