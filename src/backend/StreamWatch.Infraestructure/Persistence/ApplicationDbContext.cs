using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Identity;
using StreamWatch.Infraestructure.Persistence.Configurations;

namespace StreamWatch.Infraestructure.Persistence;


public class ApplicationDbContext : IdentityDbContext<Account>, IApplicationDbContext
{
    public ApplicationDbContext() { } 
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);                
        
        modelBuilder.ApplyConfiguration(new NotificationConfiguration());
    } 
    
    public DbSet<Friendship> Friendships => Set<Friendship>();
    public DbSet<Media> Media => Set<Media>();
    public DbSet<Ban> Bans => Set<Ban>();
    public DbSet<Notification> Notifications => Set<Notification>();
    
}