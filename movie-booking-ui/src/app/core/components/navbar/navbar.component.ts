import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  username = '';

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Subscribe to session login state
    this.sessionService.loggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
      this.username = status ? this.sessionService.getUsername() : '';
    });
  }

  logout(): void {
    this.sessionService.logout();
    this.router.navigateByUrl('/login');
  }
}
