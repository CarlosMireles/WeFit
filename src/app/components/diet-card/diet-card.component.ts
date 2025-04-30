import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {Diet} from '../../models/diet';

@Component({
  selector: 'app-diet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diet-card.component.html',
  styleUrls: ['./diet-card.component.css']
})
export class DietCardComponent {
  @Input() diet!: Diet;
  currentImageIndex = 0;
  animating = false;

  constructor(private router: Router) {}

  get images(): string[] {
    return (this.diet.meals || [])
      .map(m => m.img_url)
      .filter(u => !!u) as string[];
  }

  private swapTo(newIndex: number) {
    const nextUrl = this.images[newIndex];
    const img = new Image();
    img.onload = () => {
      this.currentImageIndex = newIndex;
      this.animating = true;
      setTimeout(() => (this.animating = false), 500);
    };
    img.src = nextUrl;
  }

  prevImage() {
    if (this.images.length < 2) return;
    const ni =
      (this.currentImageIndex + this.images.length - 1) %
      this.images.length;
    this.swapTo(ni);
  }

  nextImage() {
    if (this.images.length < 2) return;
    const ni = (this.currentImageIndex + 1) % this.images.length;
    this.swapTo(ni);
  }

  viewDiet() {
    if (this.diet.id) {
      this.router.navigate(['/diet-view', this.diet.id]);
    }
  }
}
