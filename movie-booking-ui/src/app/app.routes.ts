import { Routes } from '@angular/router';

// Pages
import { HomeComponent } from './features/movies/pages/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
import { BookTicketComponent } from './features/booking/pages/book-ticket/book-ticket.component';
import { MyTicketsComponent } from './features/booking/pages/my-tickets/my-tickets.component';

export const routes: Routes = [

  // 🏠 Home
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },

  // 🔐 Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // 🎟 User
  { path: 'book/:movieName', component: BookTicketComponent },
  { path: 'my-tickets', component: MyTicketsComponent },

  // 🛠 ADMIN (LAZY LOADED)
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/pages/admin-dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent)
  },

  // ❌ fallback
  { path: '**', redirectTo: '' }
];
