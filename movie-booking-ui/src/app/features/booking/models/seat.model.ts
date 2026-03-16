export interface Seat {
  id: string;        // A1, A2...
  row: string;       // A
  number: number;    // 1
  status: 'available' | 'selected' | 'booked';
}
