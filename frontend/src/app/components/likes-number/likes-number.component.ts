import { Component, Input } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
@Component({
  selector: 'app-likes-number',
  imports: [],
  templateUrl: './likes-number.component.html',
  styleUrl: './likes-number.component.css'
})
export class LikesNumberComponent {
  @Input() postId!: number;
  likesNumber: number = 0;
  liked: boolean = false;
  constructor(private api: RestApiService) {}
  ngOnInit() {
    this.loadLikesNumber();
    this.doILike();
  }

  loadLikesNumber() {
    this.api.getLikes(this.postId).subscribe((data) => {
      this.likesNumber = data.likeCount;
    });

}

  toggleLike() {
    this.api.toggleLike(this.postId).subscribe(() => {
      this.liked = !this.liked;
      this.loadLikesNumber();
    });
  }

  doILike() {
    this.api.doILike(this.postId).subscribe((data) => {
      this.liked = data.liked;
    });
  }
}
