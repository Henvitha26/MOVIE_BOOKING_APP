using System;
using System.Collections.Generic;

namespace MovieBookingApi.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public string MovieName { get; set; } = null!;

    public string TheatreName { get; set; } = null!;

    public int TotalTickets { get; set; }

    public int AvailableTickets { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
