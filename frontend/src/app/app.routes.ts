import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreatePostComponent } from './pages/create-post/create-post.component';
import { authGuard } from './guard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', canActivate: [authGuard],component: ProfileComponent },
    { path: 'create-post', canActivate: [authGuard], component: CreatePostComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
