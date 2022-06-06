import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Post } from '../models/post';
import { HelperService } from './helper-service';

@Injectable({
    providedIn: 'root'
})
export class SeoSocialShareService {

    static defaultImage = "https://www.ponderegg.com/assets/icon-512.png";
    static defaultFacebookImage = "https://www.ponderegg.com/assets/icon-512.png";

    constructor(private readonly metaService: Meta,
        private readonly titleService: Title,
        private readonly helperService: HelperService) { }

    viewAny() {
        this.setTitle("Dipdoo | Give choices, get answers");
        this.setDescription("Create multiple choice questions and get fast answers. Dipdoo is great for making a quiz, poll or survey.");
        this.setImage(null);

        this.metaService.removeTag(`name='og:url'`);
        this.metaService.removeTag(`name='twitter:creator'`);
        this.metaService.removeTag(`name='author'`);
    }

    viewPost(post: Post) {
        this.setTitle(`${post.title} | Dipdoo`);
        this.setDescription(post.details);
        this.setImage(post);
        

        // Twitter
        this.metaService.updateTag({name: 'twitter:card', content: "summary_large_image"});
        this.metaService.updateTag({name: 'twitter:site', content: "dipdoo.net"});
        this.metaService.updateTag({name: 'twitter:creator', content: post.username});

        // LinkedIn
        this.metaService.updateTag({property: 'og:type', content: "website"});
        this.metaService.updateTag({name: 'author', content: post.username});

        // Facebook
        //this.metaService.updateTag({property: 'og:description', content: list.description});
        this.metaService.updateTag({property: 'og:url', content: 'https://www.dipdoo.net/post/' + this.helperService.buildFriendlyId(post)});
        //this.metaService.updateTag({property: 'og:image', content: list.imageUrl});
        //this.metaService.updateTag({property: 'og:image:height', content: "xxx"});
        //this.metaService.updateTag({property: 'og:image:width', content: "xxx"});
    }

    private setTitle(title: string = '') {
        this.titleService.setTitle(title);
        if (title != null && title.length > 0) {
          this.metaService.updateTag({name: 'twitter:title', content: title});
          this.metaService.updateTag({name: 'twitter:image:alt', content: title});
          this.metaService.updateTag({property: 'og:image:alt', content: title});
          this.metaService.updateTag({property: 'og:title', content: title});
          this.metaService.updateTag({name: 'title', content: title});
        } else {
          this.metaService.removeTag(`name='twitter:title'`);
          this.metaService.removeTag(`name='twitter:image:alt'`);
          this.metaService.removeTag(`property='og:image:alt'`);
          this.metaService.removeTag(`property='og:title'`);
          this.metaService.removeTag(`name='title'`);
        }
    }

    private setDescription(desc: string = '') {
        if (desc != null && desc.length > 0) {
            this.metaService.updateTag({ name: 'description', content: desc });
            this.metaService.updateTag({name: 'twitter:description', content: desc});
            this.metaService.updateTag({property: 'og:description', content: desc});
            
        } else {
            this.metaService.removeTag(`name='description'`);
            this.metaService.removeTag(`name='twitter:description'`);
            this.metaService.removeTag(`name='og:description'`);
        }
    }

    private setImage(post: Post) {
        const canUseImageUrl =  (post != null && post.imageUrl != null && post.imageUrl.length > 0)
        const imageUrl = canUseImageUrl ? post.imageUrl : SeoSocialShareService.defaultImage;
        const fbImageUrl = canUseImageUrl ? post.imageUrl : SeoSocialShareService.defaultFacebookImage;

        this.metaService.updateTag({property: 'og:image', content: fbImageUrl});
        this.metaService.updateTag({property: 'og:image:secure_url', content: fbImageUrl});
        this.metaService.updateTag({name: 'twitter:image', content: imageUrl});
        
        if (canUseImageUrl) {
            this.metaService.removeTag(`name='og:image:width'`);
            this.metaService.removeTag(`name='og:image:height'`);
        } else {
            this.metaService.updateTag({ name: 'og:image:width', content: '512' });
            this.metaService.updateTag({ name: 'og:image:height', content: '512' });
        }
    }
}
