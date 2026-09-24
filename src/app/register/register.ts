import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common';

@Component({
imports: [FormsModule, CommonModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {

  userName = '';
  email ='';
  phoneNumber = '';
  password = '';
  errorMessage ='';

   constructor(private auth: Auth,
               private router: Router
   ){

   }
 
   register() {
    const user = 
    {
      userName: this.userName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      roleId: 2
  };

 this.auth.register(user).subscribe({

    next: (response) => {
      console.log('Registration successful:', response);
      alert('Account created successfully!');
      this.router.navigate(['/login']);
    },

    error: (error) => {
      this.errorMessage = 'Please enter all required details correctly.';    }

  });

}}
