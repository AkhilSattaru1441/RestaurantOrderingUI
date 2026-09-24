import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {

    isLoggedIn = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );

    constructor(private http: HttpClient) {

    }
       
    login(email: string, password: string) {
        return this.http.post(
       'https://localhost:7173/api/Users/login',
      {
        email: email,
        password: password
      }
    );
  }

  register(user: any){
    return this.http.post(
      'https://localhost:7173/api/Users',
      user
    )
  }
}
