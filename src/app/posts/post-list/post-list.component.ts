import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { from } from 'rxjs';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent  implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postSub: Subscription;
    constructor(public postService: PostService) {
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
    }
    ngOnInit() {
        this.postService.getPosts();
        this.postSub = this.postService.getPostUpdateListener()
            .subscribe((posts: Post[]) => {
                this.posts = posts;
            });
    }
}
