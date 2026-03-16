using MovieBookingApi.Models;

namespace MovieBookingApi.Services.Interfaces
{
    public interface IMovieService
    {
        List<Movie> GetAllMovies();
    }
}
