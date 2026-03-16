import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Seat } from '../../../../shared/models/seat.model';
import { SessionService } from '../../../../core/services/session.service';
import { BookingService } from '../../booking.service';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.scss'
})
export class BookTicketComponent implements OnInit {

  movieName = '';
  theatreName = 'PVR';

  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  ticketCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private session: SessionService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    if (!this.session.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.movieName = this.route.snapshot.paramMap.get('movieName') || '';

    this.generateSeats();
    this.loadBookedSeats(); // ✅ IMPORTANT
  }

  // 🎯 CREATE SEAT LAYOUT
  generateSeats(): void {
    const rows = ['A', 'B', 'C', 'D'];
    for (let r of rows) {
      for (let i = 1; i <= 10; i++) {
        this.seats.push({
          id: `${r}${i}`,
          selected: false,
          booked: false
        });
      }
    }
  }

  // 🔒 DISABLE ALREADY BOOKED SEATS
  loadBookedSeats(): void {
    this.bookingService.getBookedSeats(this.movieName)
      .subscribe(bookedSeats => {
        this.seats.forEach(seat => {
          if (bookedSeats.includes(seat.id)) {
            seat.booked = true;
          }
        });
      });
  }

  toggleSeat(seat: Seat): void {
    if (seat.booked) return;

    seat.selected = !seat.selected;
    this.selectedSeats = this.seats.filter(s => s.selected);
    this.ticketCount = this.selectedSeats.length;
  }

  // ✅ CONFIRM BOOKING
  confirmBooking(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const userId = this.session.getUserId();
    const seatNumbers = this.selectedSeats.map(s => s.id).join(',');

    this.bookingService.bookTicket(
      this.movieName,
      userId,
      this.selectedSeats.length,
      seatNumbers
    ).subscribe({
      next: () => {
        alert(`Booking successful!\nSeats: ${seatNumbers}`);
        this.router.navigateByUrl('/my-tickets');
      },
      error: err => alert(err?.error || 'Booking failed')
    });
  }
}
