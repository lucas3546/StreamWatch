using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StreamWatch.Core.Entities;

namespace StreamWatch.Infraestructure.Persistence.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder
            .HasOne(n => n.ToAccount)
            .WithMany(a => a.Notifications)
            .HasForeignKey(n => n.ToAccountId)
            .OnDelete(DeleteBehavior.Cascade); 
    }
}