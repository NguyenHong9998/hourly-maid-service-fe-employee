import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  // @Input('color')  color: string = 'accent';
  @Input('disabled') disabled: boolean = false;

  @Output() ratingUpdated = new EventEmitter();
  ratingArr: Array<any> = [];
  constructor() {
  }


  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  onClick(rating: any) {
    console.log(rating)

    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}

export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn",
}
