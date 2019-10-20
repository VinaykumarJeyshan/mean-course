import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { from } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent  implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postSub: Subscription;
    isLoading = false;
    totalPost = 0;
    postPerPage = 2;
    pageSizeOptions = [1, 2, 5, 10];
    currentPage = 1;
    constructor(public postService: PostService) {
    }

    ngOnDestroy() {
        this.postSub.unsubscribe();
    }
    ngOnInit() {
        this.postService.getPosts(this.postPerPage, this.currentPage);
        this.isLoading = true;
        this.postSub = this.postService.getPostUpdateListener()
            .subscribe((postData: {posts: Post[], postCount: number}) => {
                this.isLoading = false;
                this.posts = postData.posts;
                this.totalPost = postData.postCount;
            });
    }

    onChangedPage(event: PageEvent) {
        this.isLoading = true;
        this.currentPage = event.pageIndex + 1;
        this.postPerPage = event.pageSize;
        this.postService.getPosts(this.postPerPage, this.currentPage);
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postService.deletePost(postId).subscribe(() => {
            this.postService.getPosts(this.postPerPage, this.currentPage);
        });
    }
}
