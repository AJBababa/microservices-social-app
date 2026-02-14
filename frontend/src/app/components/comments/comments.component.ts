import { Component, Input } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  @Input() postId!: number;
  public newCommentContent: string = '';
  commentsList: any[] = [];
  constructor(public auth: RestApiService) { }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.auth.getComments(this.postId).subscribe((data) => {
      console.log('Comments for post', data);
      this.commentsList = data;
    });
  }

  addComment() {
    this.auth.createComment(this.postId.toString(), this.newCommentContent).subscribe(response => {
      console.log('Comment added successfully', response);
      this.loadComments(); // Refresh comments after adding a new one
    });
  }

  deleteComment(commentId: number) {
    this.auth.deleteComment(commentId.toString()).subscribe(response => {
      console.log('Comment deleted successfully', response);
      this.loadComments(); // Refresh comments after deletion
    });
  }
}
