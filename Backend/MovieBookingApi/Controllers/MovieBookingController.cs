using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using MovieBookingApi.Data;
using MovieBookingApi.DTOs;
using MovieBookingApi.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MovieBookingApi.Controllers
{
    [ApiController]
    [Route("api/v1.0/moviebooking")]
    [EnableRateLimiting("fixed")] // 🔥 Apply rate limiting to ALL endpoints
    public class MovieBookingController : ControllerBase
    {
        private readonly MovieBookingDbContext _context;
        private readonly ILogger<MovieBookingController> _logger;

        public MovieBookingController(
            MovieBookingDbContext context,
            ILogger<MovieBookingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // =========================
        // 1️⃣ REGISTER USER
        // =========================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            _logger.LogInformation("Register request received for username: {Username}", request.Username);

            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                _logger.LogWarning("Username already exists: {Username}", request.Username);
                return BadRequest("Username already exists");
            }

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                _logger.LogWarning("Email already exists: {Email}", request.Email);
                return BadRequest("Email already exists");
            }

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Username = request.Username,
                PasswordHash = request.Password,
                ContactNumber = request.ContactNumber,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("User registered successfully: {Username}", request.Username);
            return Ok("User registered successfully");
        }

        // =========================
        // 2️⃣ LOGIN
        // =========================
        [HttpGet("login")]
        public async Task<IActionResult> Login([FromQuery] string username, [FromQuery] string password)
        {
            _logger.LogInformation("Login attempt for username: {Username}", username);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);

            if (user == null)
            {
                _logger.LogWarning("Invalid login attempt for username: {Username}", username);
                return Unauthorized("Invalid credentials");
            }

            _logger.LogInformation("Login successful for username: {Username}", username);
            return Ok("Login successful");
        }

        // =========================
        // 3️⃣ FORGOT PASSWORD
        // =========================
        [HttpGet("{username}/forgot")]
        public async Task<IActionResult> ForgotPassword(
            [FromRoute] string username,
            [FromQuery] string newPassword)
        {
            _logger.LogInformation("Forgot password request for username: {Username}", username);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                _logger.LogWarning("User not found for forgot password: {Username}", username);
                return NotFound("User not found");
            }

            user.PasswordHash = newPassword;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Password reset successful for username: {Username}", username);
            return Ok("Password reset successful");
        }

        // =========================
        // 4️⃣ ADD MOVIE (ADMIN)
        // =========================
        [HttpPost("movie/add")]
        public async Task<IActionResult> AddMovie([FromBody] AddMovieRequestDto request)
        {
            _logger.LogInformation("Add movie request received: {Movie}", request.MovieName);

            if (await _context.Movies.AnyAsync(m => m.MovieName == request.MovieName))
            {
                _logger.LogWarning("Movie already exists: {Movie}", request.MovieName);
                return BadRequest("Movie already exists");
            }

            var movie = new Movie
            {
                MovieName = request.MovieName,
                TheatreName = request.TheatreName,
                TotalTickets = request.TotalTickets,
                AvailableTickets = request.TotalTickets,
                Status = "BOOK ASAP",
                CreatedAt = DateTime.Now
            };

            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Movie added successfully: {Movie}", request.MovieName);
            return Ok("Movie added successfully");
        }

        // =========================
        // 5️⃣ GET ALL MOVIES (30s TIMEOUT)
        // =========================
        [HttpGet("all")]
        public async Task<IActionResult> GetAllMovies()
        {
            _logger.LogInformation("Fetching all movies");

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));

            var movies = await _context.Movies
                .AsNoTracking()
                .ToListAsync(cts.Token);

            _logger.LogInformation("Fetched {Count} movies", movies.Count);
            return Ok(movies);
        }

        // =========================
        // 6️⃣ SEARCH MOVIE
        // =========================
        [HttpGet("movies/search/{moviename}")]
        public async Task<IActionResult> SearchMovie(string moviename)
        {
            _logger.LogInformation("Searching movies with keyword: {Keyword}", moviename);

            var movies = await _context.Movies
                .Where(m => m.MovieName.ToLower().Contains(moviename.ToLower()))
                .AsNoTracking()
                .ToListAsync();

            _logger.LogInformation("Search completed. Results found: {Count}", movies.Count);
            return Ok(movies);
        }

        // =========================
        // 7️⃣ BOOK TICKET
        // =========================
        [HttpPost("{moviename}/add")]
        public async Task<IActionResult> BookTicket(
            [FromRoute] string moviename,
            [FromQuery] int userId,
            [FromQuery] int tickets)
        {
            _logger.LogInformation("Booking {Tickets} tickets for movie {Movie}", tickets, moviename);

            var movie = await _context.Movies
                .FirstOrDefaultAsync(m => m.MovieName.ToLower() == moviename.ToLower());

            if (movie == null)
            {
                _logger.LogWarning("Movie not found: {Movie}", moviename);
                return NotFound("Movie not found");
            }

            if (movie.AvailableTickets < tickets)
            {
                _logger.LogWarning("Insufficient tickets for movie {Movie}", moviename);
                return BadRequest("Not enough tickets available");
            }

            movie.AvailableTickets -= tickets;
            movie.Status = movie.AvailableTickets == 0 ? "SOLD OUT" : "BOOK ASAP";

            var ticket = new Ticket
            {
                UserId = userId,
                MovieId = movie.MovieId,
                TicketsBooked = tickets,
                BookingDate = DateTime.Now
            };

            await _context.Tickets.AddAsync(ticket);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Ticket booked successfully for movie {Movie}", moviename);
            return Ok("Ticket booked successfully");
        }

        // =========================
        // 8️⃣ UPDATE MOVIE STATUS
        // =========================
        [HttpPut("{moviename}/update/{status}")]
        public async Task<IActionResult> UpdateMovieStatus(string moviename, string status)
        {
            _logger.LogInformation("Updating status for movie {Movie} to {Status}", moviename, status);

            var movie = await _context.Movies
                .FirstOrDefaultAsync(m => m.MovieName.ToLower() == moviename.ToLower());

            if (movie == null)
            {
                _logger.LogWarning("Movie not found for status update: {Movie}", moviename);
                return NotFound("Movie not found");
            }

            movie.Status = status;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Movie status updated successfully for {Movie}", moviename);
            return Ok("Movie status updated");
        }

        // =========================
        // 9️⃣ DELETE MOVIE
        // =========================
        [HttpDelete("{moviename}/delete/{id}")]
        public async Task<IActionResult> DeleteMovie(string moviename, int id)
        {
            _logger.LogInformation("Delete request received for movie id: {Id}", id);

            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieId == id);

            if (movie == null)
            {
                _logger.LogWarning("Movie not found for deletion. Id: {Id}", id);
                return NotFound("Movie not found");
            }

            var tickets = _context.Tickets.Where(t => t.MovieId == id);
            _context.Tickets.RemoveRange(tickets);
            _context.Movies.Remove(movie);

            await _context.SaveChangesAsync();

            _logger.LogInformation("Movie deleted successfully. Id: {Id}", id);
            return Ok("Movie deleted successfully");
        }
        // 10️⃣ GET MY TICKETS (USER)
        [HttpGet("tickets/{userId}")]
        public async Task<IActionResult> GetMyTickets([FromRoute] int userId)
        {
            var tickets = await _context.Tickets
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.BookingDate)
                .Join(
                    _context.Movies,
                    t => t.MovieId,
                    m => m.MovieId,
                    (t, m) => new
                    {
                        movieName = m.MovieName,
                        theatreName = m.TheatreName,
                        quantity = t.TicketsBooked,
                        bookingDate = t.BookingDate,
                        status = "Confirmed"
                    }
                )
                .ToListAsync();

            return Ok(tickets);
        }

    }
}
