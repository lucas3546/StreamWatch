using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Identity;
using StreamWatch.Infraestructure.Persistence.Configurations;

namespace StreamWatch.Infraestructure.Persistence;


public class ApplicationDbContext : IdentityDbContext<Account>
{
    public ApplicationDbContext() { } 
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);                
        
        modelBuilder.ApplyConfiguration(new NotificationConfiguration());
    } 
    
    public DbSet<Friendship> Friendships { get; set; }
    public DbSet<Media> Media { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    
}