using MovieBookingApi.Data;
using MovieBookingApi.Models;
using MovieBookingApi.Services.Interfaces;

namespace MovieBookingApi.Services
{
    public class MovieService : IMovieService
    {
        private readonly MovieBookingDbContext _context;

        public MovieService(MovieBookingDbContext context)
        {
            _context = context;
        }

        public List<Movie> GetAllMovies()
        {
            return _context.Movies.ToList();
        }
    }
}
