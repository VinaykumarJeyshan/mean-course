import { Component, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
    // posts = [
    //     {title: 'First Post', content: 'this is first post'},
    //     {title: 'Second Post', content: 'this is second post'},
    //     {title: 'Third Post', content: 'this is third post'},
    // ];
    @Input() posts: Post[] = [];
    constructor(public postService: PostService) {
    }
}
