import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Movie } from '../../../../shared/models/movie.model';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],   // ✅ RouterLink removed
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {

  @Input() movie!: Movie;

  constructor(
    private router: Router,
    public session: SessionService
  ) {}

  // 🔒 SINGLE SOURCE OF TRUTH
  get soldOut(): boolean {
    return (
      this.movie.availableTickets === 0 ||
      this.movie.status === 'SOLD OUT'
    );
  }

  bookNow(): void {
    // 🚫 redirect if not logged in
    if (!this.session.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }

    // 🚫 block sold out booking
    if (this.soldOut) return;

    // 🎟 go to seat selection page
    this.router.navigate(['/book', this.movie.movieName]);
  }
}
