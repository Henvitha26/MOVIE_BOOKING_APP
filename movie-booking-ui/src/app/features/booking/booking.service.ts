import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // =========================
  // 🎟 BOOK TICKET (WITH SEATS)
  // =========================
  bookTicket(
    movieName: string,
    userId: number,
    tickets: number,
    seatNumbers: string
  ): Observable<string> {
    const encodedMovie = encodeURIComponent(movieName);

    return this.http.post(
      `${this.baseUrl}/${encodedMovie}/add`,
      {},
      {
        params: {
          userId,
          tickets,
          seatNumbers
        },
        responseType: 'text'
      }
    );
  }

  // =========================
  // 🎫 GET MY TICKETS (USER ONLY)
  // =========================
  getMyTickets(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/tickets/${userId}`
    );
  }

  // =========================
  // ✅ GET BOOKED SEATS (PER MOVIE)
  // =========================
  getBookedSeats(movieName: string): Observable<string[]> {
    const encodedMovie = encodeURIComponent(movieName);

    return this.http.get<string[]>(
      `${this.baseUrl}/movies/${encodedMovie}/seats`
    );
  }
}
