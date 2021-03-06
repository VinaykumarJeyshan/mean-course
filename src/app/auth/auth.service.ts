import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const USER_URL = environment.apiUrl + '/user/';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private isAuthenticated = false;
    private tokeTimer: any;
    private authStatusListener = new Subject<boolean>();
    private userId: string;
    constructor(private http: HttpClient, private router: Router) {
    }

    getToken() {
        return this.token;
    }
    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }
    createUser(email: string, password: string) {
        const authData: AuthData = {
            email,
            password
        };
        this.http.post(USER_URL + '/signup', authData)
            .subscribe(() => {
                this.router.navigate(['/']);
            }, err => {
                this.authStatusListener.next(false);
            });
    }
    login(email: string, password: string) {
        const authData: AuthData = {
            email,
            password
        };
        this.http.post<{ token: string, expiresIn: number, userId: string }>(
            USER_URL + '/login',
            authData
        )
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate, this.userId);
                    this.router.navigate(['/']);
                }
            }, err => {
                this.authStatusListener.next(false);
            });
    }
    private setAuthTimer(duration: number) {
        this.tokeTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }
    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }
    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        this.router.navigate(['/']);
        this.clearAuthData();
        clearTimeout(this.tokeTimer);
    }
    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token,
            expirationDate: new Date(expirationDate),
            userId
        };
    }
}
