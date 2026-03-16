import { FormsModule } from "@angular/forms";
import { MovieCardComponent } from "../../../movies/components/movie-card/movie-card.component";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MovieCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Home component logic goes here
}