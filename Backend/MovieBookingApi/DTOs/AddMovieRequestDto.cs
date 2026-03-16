namespace MovieBookingApi.DTOs
{
    public class AddMovieRequestDto
    {
        public string MovieName { get; set; }
        public string TheatreName { get; set; }
        public int TotalTickets { get; set; }
    }
}
