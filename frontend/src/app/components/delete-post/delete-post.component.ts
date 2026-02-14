import { Component, Input } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-post',
  imports: [CommonModule],
  templateUrl: './delete-post.component.html',
  styleUrl: './delete-post.component.css'
})
export class DeletePostComponent {
  @Input() postId!: string;

  constructor(private api: RestApiService) {} 
  deletePost() {
    this.api.deletePost(this.postId).subscribe(response => {
      console.log('Post deleted successfully', response);
    });
}
}
