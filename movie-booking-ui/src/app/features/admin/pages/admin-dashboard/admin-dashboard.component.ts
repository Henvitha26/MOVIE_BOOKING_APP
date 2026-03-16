import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Movie } from '../../../../shared/models/movie.model';
import { SessionService } from '../../../../core/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {

  movies: Movie[] = [];
  loading = false;
  error = '';
  success = '';

  newMovie = {
    movieName: '',
    theatreName: '',
    totalTickets: 0,
  };

  constructor(
    private adminService: AdminService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.session.isLoggedIn() || this.session.getUsername() !== 'admin') {
      this.router.navigateByUrl('/login');
      return;
    }
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.adminService.getAllMovies().subscribe({
      next: (res: any[]) => {
        // ✅ NORMALIZE BACKEND RESPONSE (MovieId -> id)
        this.movies = (res || []).map((m: any) => {
          const total = Number(m.totalTickets ?? 0);
          const available = Number(m.availableTickets ?? 0);

          return {
            ...m,
            movieId: m.movieId ?? m.MovieId,
            id: m.id ?? m.movieId ?? m.MovieId, // ✅ ensures delete works
            bookedTickets: m.bookedTickets ?? (total - available),
            totalTickets: total,
            availableTickets: available,
          } as Movie;
        });

        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load movies';
        this.loading = false;
      }
    });
  }

  addMovie(): void {
    this.error = '';
    this.success = '';

    if (!this.newMovie.movieName || !this.newMovie.theatreName || !this.newMovie.totalTickets) {
      this.error = 'Please fill all fields';
      return;
    }

    this.adminService.addMovie(this.newMovie).subscribe({
      next: (msg) => {
        this.success = msg || 'Movie added successfully';
        this.newMovie = { movieName: '', theatreName: '', totalTickets: 0 };
        this.loadMovies();
      },
      error: (err) => {
        this.error = err?.error || 'Add movie failed';
      }
    });
  }

  markSoldOut(m: Movie) {
    this.adminService.updateStatus(m.movieName, 'SOLD OUT')
      .subscribe(() => this.loadMovies());
  }

  markBookAsap(m: Movie) {
    this.adminService.updateStatus(m.movieName, 'BOOK ASAP')
      .subscribe(() => this.loadMovies());
  }

  markAvailable(m: Movie) {
    this.adminService.updateStatus(m.movieName, 'AVAILABLE')
      .subscribe(() => this.loadMovies());
  }

  refreshAvailability(m: Movie) {
    let status = 'AVAILABLE';

    if (m.availableTickets === 0) status = 'SOLD OUT';
    else if (m.availableTickets <= m.totalTickets / 2) status = 'BOOK ASAP';

    this.adminService.updateStatus(m.movieName, status)
      .subscribe(() => this.loadMovies());
  }

  // ✅ DELETE WORKING
  deleteMovie(m: Movie): void {
    this.error = '';
    this.success = '';

    const id = m.id ?? m.movieId;

    if (!id) {
      this.error = 'Movie ID missing';
      return;
    }

    const ok = confirm(`Delete "${m.movieName}"?\nThis will remove all tickets for this movie.`);
    if (!ok) return;

    this.adminService.deleteMovie(m.movieName, id).subscribe({
      next: (msg) => {
        this.success = msg || 'Movie deleted successfully';
        this.loadMovies(); // ✅ refresh admin list
      },
      error: (err) => {
        this.error = err?.error || 'Delete failed';
      }
    });
  }
}
