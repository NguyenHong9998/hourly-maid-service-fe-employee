import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageItem } from '@core/utils';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable } from 'rxjs';

const AUTH_API = 'http://localhost:5000/api/public/';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    httpOptions: any;
    isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem(StorageItem.Auth));

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            'Access-Control-Allow-Origin': 'http://localhost:4200',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
        };
    }

    login(loginForm: any): Observable<any> {
        return this.http.post(environment.apiUrl + "/auth/login", loginForm, this.httpOptions);
    }

    register(obj: any): Observable<any> {
        console.log(obj);
        return this.http.post(AUTH_API + 'signup', {
            bookId: obj.book_id,
            name: obj.name,
            gender: obj.gender,
            dateOfBirth: obj.dateOfBirth,
            guardian: obj.guardian,
            address: obj.address,
            phone: obj.phone,
            email: obj.email,
            password: obj.password,
        }, this.httpOptions);
    }

    verify(code: string): Observable<any> {
        console.log(code);
        return this.http.post(AUTH_API + 'verify', {
            code: code
        }, this.httpOptions);
    }

    verifyPassword(code: string): Observable<any> {
        return this.http.post(AUTH_API + 'verify-password', {
            code: code
        }, this.httpOptions);
    }

    resetPassword(username: string): Observable<any> {
        return this.http.post(AUTH_API + 'reset-password', {
            username: username,
        }, this.httpOptions);
    }

    doResetPassword(password: string, code: string): Observable<any> {
        return this.http.post(AUTH_API + 'do-reset-password', {
            password: password,
            code: code
        }, this.httpOptions);
    }
}
