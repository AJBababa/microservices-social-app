import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  apiUrl = 'http://frontend.localhost/api/';
  tokenKEy = 'authToken';
  username = '';
  isLoggedIn = signal(false);

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const res = this.http.post(this.apiUrl + 'auth/login', { username, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKEy, response.token);
        }
      })
    );
    this.isLoggedIn.set(true);
    this.username = username;
    return res;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKEy);
  }

  getUsername(): string {
    return this.username;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKEy);
    localStorage.removeItem(this.tokenKEy);
    this.isLoggedIn.set(false);
    this.username = '';
  }

  getProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.get(this.apiUrl + 'user/profile', { headers });
  }

  getPosts(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'public/post');
  }

  createPost(content: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.post<any>(this.apiUrl + 'post', { content }, { headers });
  }
  deletePost(postId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.delete<any>(this.apiUrl + `post/${postId}`, { headers });
  }

  getComments(postId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.get<any>(this.apiUrl + `comment/` + postId.toString(), { headers });;
  }

  createComment(postId: string, content: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.post<any>(this.apiUrl + `comment`, { postId, content }, { headers });
  }

  deleteComment(commentId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.delete<any>(this.apiUrl + `comment/${commentId}`, { headers });
  }

  getLikes(postId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.get<any>(this.apiUrl + `like/${postId}`, { headers });;
  }

  toggleLike(postId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.post<any>(this.apiUrl + `like/toggle`, { postId }, { headers });
  }

  doILike(postId: number): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of({ liked: false });
    }
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.get<any>(this.apiUrl + `like/doilike/${postId}`, { headers });
  }

}