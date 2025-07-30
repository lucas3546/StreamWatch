using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Core.Identity;

namespace StreamWatch.Infraestructure.Persistence;


public class ApplicationDbContext : IdentityDbContext<Account>
{
    public ApplicationDbContext() { } 
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);                   
    } 
    
}