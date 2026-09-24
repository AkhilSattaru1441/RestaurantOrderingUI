import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { jwtDecode } from 'jwt-decode';
import {  Router,RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule,RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  email = '';
  password = '';

  constructor(private auth: Auth,
              private router:Router 
  ) {

  }

login() {
  this.auth.login(this.email, this.password).subscribe({
    next: (response: any) => {
  localStorage.setItem('token', response.token);
  const decodedToken: any = jwtDecode(response.token);
  console.log('Decoded Token:', decodedToken);

  const userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  console.log('User Name:', userName);
  localStorage.setItem('userName',userName);

  const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  localStorage.setItem('userId', userId);

  this.auth.isLoggedIn.next(true);
  console.log('login state:', this.auth.isLoggedIn.value);

  console.log('User ID:', userId); 
  console.log(decodedToken);      
  console.log('Login successful');
  this.router.navigate(['/home']);
    },

    error: (error) => {
      console.log(error);
    }
  });
}
logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    console.log('Logged out');
  }

}