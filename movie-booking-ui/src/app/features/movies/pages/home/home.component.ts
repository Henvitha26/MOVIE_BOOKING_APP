import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../../movies.service';
import { Movie } from '../../../../shared/models/movie.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  searchText = '';
  loading = false;
  error = '';

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.error = '';

    this.moviesService.getAllMovies().subscribe({
      next: (res) => {
        this.movies = res || [];
        this.filteredMovies = this.movies;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load movies. Start backend.';
        this.loading = false;
      }
    });
  }

  search(): void {
    this.error = '';

    if (!this.searchText.trim()) {
      this.filteredMovies = this.movies;
      return;
    }

    this.loading = true;
    this.moviesService.searchMovies(this.searchText).subscribe({
      next: (res) => {
        this.filteredMovies = res || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Search failed';
        this.loading = false;
      }
    });
  }
}
