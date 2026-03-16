using Microsoft.EntityFrameworkCore;
using MovieBookingApi.Models;

namespace MovieBookingApi.Data
{
    public partial class MovieBookingDbContext : DbContext
    {
        public MovieBookingDbContext()
        {
        }

        public MovieBookingDbContext(DbContextOptions<MovieBookingDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Admin> Admins { get; set; }

        public virtual DbSet<Movie> Movies { get; set; }

        public virtual DbSet<Ticket> Tickets { get; set; }

        public virtual DbSet<User> Users { get; set; }

        // ❌ REMOVED OnConfiguring
        // Database provider is configured in Program.cs or Test project

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.AdminId)
                      .HasName("PK__Admins__719FE4885B67DB86");

                entity.HasIndex(e => e.Username)
                      .IsUnique();

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("(getdate())")
                      .HasColumnType("datetime");

                entity.Property(e => e.PasswordHash)
                      .HasMaxLength(255);

                entity.Property(e => e.Username)
                      .HasMaxLength(100);
            });

            modelBuilder.Entity<Movie>(entity =>
            {
                entity.HasKey(e => e.MovieId)
                      .HasName("PK__Movies__4BD2941A09D9B13F");

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("(getdate())")
                      .HasColumnType("datetime");

                entity.Property(e => e.MovieName)
                      .HasMaxLength(200);

                entity.Property(e => e.Status)
                      .HasMaxLength(50)
                      .HasDefaultValue("BOOK ASAP");

                entity.Property(e => e.TheatreName)
                      .HasMaxLength(150);
            });

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.HasKey(e => e.TicketId)
                      .HasName("PK__Tickets__712CC607768281F2");

                entity.Property(e => e.BookingDate)
                      .HasDefaultValueSql("(getdate())")
                      .HasColumnType("datetime");

                entity.HasOne(d => d.Movie)
                      .WithMany(p => p.Tickets)
                      .HasForeignKey(d => d.MovieId)
                      .OnDelete(DeleteBehavior.ClientSetNull)
                      .HasConstraintName("FK_Tickets_Movies");

                entity.HasOne(d => d.User)
                      .WithMany(p => p.Tickets)
                      .HasForeignKey(d => d.UserId)
                      .OnDelete(DeleteBehavior.ClientSetNull)
                      .HasConstraintName("FK_Tickets_Users");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId)
                      .HasName("PK__Users__1788CC4C9060C570");

                entity.HasIndex(e => e.Username)
                      .IsUnique();

                entity.HasIndex(e => e.Email)
                      .IsUnique();

                entity.Property(e => e.ContactNumber)
                      .HasMaxLength(15);

                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("(getdate())")
                      .HasColumnType("datetime");

                entity.Property(e => e.Email)
                      .HasMaxLength(150);

                entity.Property(e => e.FirstName)
                      .HasMaxLength(100);

                entity.Property(e => e.IsActive)
                      .HasDefaultValue(true);

                entity.Property(e => e.LastName)
                      .HasMaxLength(100);

                entity.Property(e => e.PasswordHash)
                      .HasMaxLength(255);

                entity.Property(e => e.Username)
                      .HasMaxLength(100);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
