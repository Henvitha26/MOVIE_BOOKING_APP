using Microsoft.EntityFrameworkCore;
using MovieBookingApi.Data;

namespace MovieBookingApi.Tests.Helpers
{
    public static class DbContextHelper
    {
        public static MovieBookingDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<MovieBookingDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // unique per test
                .Options;

            return new MovieBookingDbContext(options);
        }
    }
}
