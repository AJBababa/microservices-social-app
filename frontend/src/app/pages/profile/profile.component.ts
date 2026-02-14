import { Component } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
 profile : {
  message: string;
  user:{
    id: number;
    username: string;
    role: string;
    iat: number;
    exp: number;
  }
 } | null = null;

constructor(private restApiService : RestApiService) {};

 ngOnInit(){
  this.loadProfile();
 }
  loadProfile(){
    this.restApiService.getProfile().subscribe((data) => {
      this.profile = data;
    });
  }

}