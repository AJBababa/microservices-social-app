import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';
import { CommonModule } from '@angular/common';
import { LikesNumberComponent } from '../../components/likes-number/likes-number.component';
import { CommentsComponent } from '../../components/comments/comments.component';
import { inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, CommonModule, LikesNumberComponent, CommentsComponent, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  protected readonly auth = inject(RestApiService);
  title = 'frontend';

  posts: any[] = [];
  commentsVisible: { [postId: string]: boolean } = {};

  constructor(private api: RestApiService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.api.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  deletePost(postId: string) {
    this.api.deletePost(postId).subscribe(response => {
      console.log('Post deleted successfully', response);
      this.loadPosts(); // Refresh the posts list after deletion
    });
  }

  toggleComments(postId: string) {
    this.commentsVisible[postId] = !this.commentsVisible[postId];
  }


}
