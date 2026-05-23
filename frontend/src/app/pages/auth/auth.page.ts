import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false,
})
export class AuthPage {
  isLogin = true;
  email = '';
  password = '';
  name = '';

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  onLogin(): void {
    this.auth.login(this.email, this.password).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  onRegister(): void {
    this.auth.register(this.email, this.password, this.name).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}
