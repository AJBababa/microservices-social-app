import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestApiService } from '../../services/rest-api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
 constructor(private api: RestApiService, private router: Router  ) {}

  content: string = '';

  createPost() {
  this.api.createPost(this.content).subscribe(response => {
    console.log('Post created successfully', response);
    this.content = ''; // Clear the input field
    //si la response contiene el id del post recien creado, podemos redirigir a la pagina del post
    if (response.id) {
      this.router.navigate(['']);
    }
    else {  
      console.error('Post ID not found in response');
    }
  });
  }
}  

