import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-carousel-header',
  standalone: true,
  imports: [GalleriaModule, ImageModule],
  templateUrl: './carousel-header.component.html'
})
export class CarouselHeaderComponent implements OnInit {
  images: any[] | undefined;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  ngOnInit() {
    this.images = [
      {
        itemImageSrc:
          'https://www.kicksonfire.com/wp-content/uploads/2023/10/jae-tips-saucony-progrid-omni-9-7.jpeg?x58464',
        alt: 'Description for Image 1',
        title: 'Title 1'
      },
      {
        itemImageSrc:
          'https://www.kicksonfire.com/wp-content/uploads/2024/01/nicole-mclaughlin-puma-suede-2024-1.png?x58464',
        alt: 'Description for Image 2',
        title: 'Title 2'
      },
      {
        itemImageSrc:
          'https://www.kicksonfire.com/wp-content/uploads/2024/01/Screen-Shot-2024-01-17-at-1-17-03-PM.png?x58464',
        alt: 'Description for Image 3',
        title: 'Title 3'
      }
    ];
  }
}

