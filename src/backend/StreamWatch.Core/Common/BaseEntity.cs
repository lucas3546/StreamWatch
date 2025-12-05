namespace StreamWatch.Core.Common;

public abstract class BaseEntity<TKey>
{
    public TKey Id { get; set; }
}
