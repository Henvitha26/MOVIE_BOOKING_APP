import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Movie } from '../../shared/models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // =========================
  // 🎬 GET ALL MOVIES
  // =========================
  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(
      `${this.baseUrl}/all`
    );
  }

  // =========================
  // ➕ ADD MOVIE
  // =========================
  addMovie(payload: {
    movieName: string;
    theatreName: string;
    totalTickets: number;
  }): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/movie/add`,
      payload,
      { responseType: 'text' }
    );
  }

  // =========================
  // 🔄 UPDATE MOVIE STATUS
  // =========================
  updateStatus(movieName: string, status: string): Observable<string> {
    const encodedMovie = encodeURIComponent(movieName);
    const encodedStatus = encodeURIComponent(status);

    return this.http.put(
      `${this.baseUrl}/${encodedMovie}/update/${encodedStatus}`,
      {},
      { responseType: 'text' }
    );
  }

  // =========================
  // ❌ DELETE MOVIE (CASCADE SAFE)
  // =========================
  deleteMovie(movieName: string, id: number): Observable<string> {
    const encodedMovie = encodeURIComponent(movieName);

    return this.http.delete(
      `${this.baseUrl}/${encodedMovie}/delete/${id}`,
      { responseType: 'text' }
    );
  }
  // =========================
// 👑 GET ALL BOOKED TICKETS (ADMIN)
// =========================
getAllBookedTickets(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.baseUrl}/admin/tickets`
  );
}

}
