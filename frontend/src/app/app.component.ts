import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { authGuard } from './guard/auth.guard';
import { inject, signal } from '@angular/core';
import { RestApiService } from './services/rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly title = signal('frontend');
  protected readonly auth = inject(RestApiService);
  protected readonly router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}


