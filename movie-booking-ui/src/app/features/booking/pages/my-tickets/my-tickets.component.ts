import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../booking.service';
import { Ticket } from '../../../../shared/models/ticket.model';
import { SessionService } from '../../../../core/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.scss'
})
export class MyTicketsComponent implements OnInit {

  tickets: Ticket[] = [];
  loading = false;
  error = '';

  constructor(
    private bookingService: BookingService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.session.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.loadTickets();
  }

  loadTickets(): void {
    const userId = this.session.getUserId();

    this.bookingService.getMyTickets(userId).subscribe({
      next: (res) => this.tickets = res,
      error: () => this.error = 'Unable to load tickets'
    });
  }
}
