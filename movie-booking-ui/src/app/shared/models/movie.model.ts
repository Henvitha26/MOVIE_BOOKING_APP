export interface Movie {
  // backend key
  movieId?: number;

  // frontend normalized key (we will fill this)
  id?: number;

  movieName: string;
  theatreName: string;

  totalTickets: number;
  availableTickets: number;

  // backend may or may not send this; we compute if missing
  bookedTickets?: number;

  status: string; // "AVAILABLE" | "BOOK ASAP" | "SOLD OUT"
}
