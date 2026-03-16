using System;
using System.Collections.Generic;

namespace MovieBookingApi.Models;

public partial class Ticket
{
    public int TicketId { get; set; }

    public int UserId { get; set; }

    public int MovieId { get; set; }

    public int TicketsBooked { get; set; }

    public DateTime? BookingDate { get; set; }

    public virtual Movie Movie { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
