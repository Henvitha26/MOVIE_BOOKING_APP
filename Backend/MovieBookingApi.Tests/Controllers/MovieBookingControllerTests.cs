using Microsoft.Extensions.Logging.Abstractions;
using MovieBookingApi.Controllers;
using MovieBookingApi.DTOs;
using MovieBookingApi.Models;
using MovieBookingApi.Tests.Helpers;
using NUnit.Framework;
using Microsoft.AspNetCore.Mvc;

namespace MovieBookingApi.Tests.Controllers
{
    [TestFixture]
    public class MovieBookingControllerTests
    {
        // 1️⃣ Register should create user successfully
        [Test]
        public async Task Register_WhenValid_ShouldReturnOk()
        {
            // Arrange
            var context = DbContextHelper.CreateInMemoryDbContext();
            var logger = NullLogger<MovieBookingController>.Instance;
            var controller = new MovieBookingController(context, logger);

            var dto = new RegisterRequestDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@gmail.com",
                Username = "john123",
                Password = "Test@123",
                ContactNumber = "9999999999"
            };

            // Act
            var result = await controller.Register(dto);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            Assert.That(context.Users.Count(), Is.EqualTo(1));
        }

        // 2️⃣ Register duplicate username should return BadRequest
        [Test]
        public async Task Register_WhenUsernameExists_ShouldReturnBadRequest()
        {
            // Arrange
            var context = DbContextHelper.CreateInMemoryDbContext();
            context.Users.Add(new User
            {
                FirstName = "A",
                LastName = "B",
                Email = "a@gmail.com",
                Username = "sameuser",
                PasswordHash = "123",
                ContactNumber = "111",
                IsActive = true,
                CreatedAt = DateTime.Now
            });
            await context.SaveChangesAsync();

            var logger = NullLogger<MovieBookingController>.Instance;
            var controller = new MovieBookingController(context, logger);

            var dto = new RegisterRequestDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john@gmail.com",
                Username = "sameuser",
                Password = "Test@123",
                ContactNumber = "9999999999"
            };

            // Act
            var result = await controller.Register(dto);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        }

        // 3️⃣ AddMovie should add movie
        [Test]
        public async Task AddMovie_WhenValid_ShouldReturnOk_AndInsertMovie()
        {
            // Arrange
            var context = DbContextHelper.CreateInMemoryDbContext();
            var logger = NullLogger<MovieBookingController>.Instance;
            var controller = new MovieBookingController(context, logger);

            var dto = new AddMovieRequestDto
            {
                MovieName = "Inception",
                TheatreName = "PVR",
                TotalTickets = 100
            };

            // Act
            var result = await controller.AddMovie(dto);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            Assert.That(context.Movies.Count(), Is.EqualTo(1));

            var savedMovie = context.Movies.First();
            Assert.That(savedMovie.AvailableTickets, Is.EqualTo(100));
        }

        // 4️⃣ BookTicket should reduce available tickets and create ticket
        [Test]
        public async Task BookTicket_WhenValid_ShouldReduceTickets_AndCreateTicket()
        {
            // Arrange
            var context = DbContextHelper.CreateInMemoryDbContext();

            // Add movie
            context.Movies.Add(new Movie
            {
                MovieId = 1,
                MovieName = "Horror",
                TheatreName = "INOX",
                TotalTickets = 10,
                AvailableTickets = 10,
                Status = "BOOK ASAP",
                CreatedAt = DateTime.Now
            });

            // Add user
            context.Users.Add(new User
            {
                UserId = 1,
                FirstName = "Test",
                LastName = "User",
                Email = "test@gmail.com",
                Username = "testuser",
                PasswordHash = "123",
                ContactNumber = "999",
                IsActive = true,
                CreatedAt = DateTime.Now
            });

            await context.SaveChangesAsync();

            var logger = NullLogger<MovieBookingController>.Instance;
            var controller = new MovieBookingController(context, logger);

            // Act
            var result = await controller.BookTicket("Horror", userId: 1, tickets: 2);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            Assert.That(context.Tickets.Count(), Is.EqualTo(1));

            var movie = context.Movies.First();
            Assert.That(movie.AvailableTickets, Is.EqualTo(8));
        }

        // 5️⃣ BookTicket should return NotFound if movie missing
        [Test]
        public async Task BookTicket_WhenMovieNotFound_ShouldReturnNotFound()
        {
            // Arrange
            var context = DbContextHelper.CreateInMemoryDbContext();
            var logger = NullLogger<MovieBookingController>.Instance;
            var controller = new MovieBookingController(context, logger);

            // Act
            var result = await controller.BookTicket("NoMovie", userId: 1, tickets: 1);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
        }
    }
}
