using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StreamWatch.Core.Entities;

namespace StreamWatch.Infraestructure.Persistence.Configurations;

public class FriendInvitationConfiguration : IEntityTypeConfiguration<FriendInvitation>
{
    public void Configure(EntityTypeBuilder<FriendInvitation> builder)
    {
        builder
            .HasOne(fi => fi.ToAccount)
            .WithMany(a => a.ReceivedInvitations)
            .HasForeignKey(fi => fi.ToAccountId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder
            .HasOne(fi => fi.CreatedByAccount)
            .WithMany()
            .HasForeignKey(fi => fi.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
