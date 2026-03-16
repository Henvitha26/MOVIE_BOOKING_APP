import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Movie } from '../../shared/models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/all`);
  }

  searchMovies(name: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/movies/search/${encodeURIComponent(name)}`);
  }
}
