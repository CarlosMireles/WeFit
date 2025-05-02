import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-user-template-image-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-template-image-name.component.html',
  styleUrl: './user-template-image-name.component.css'
})
export class UserTemplateImageNameComponent implements OnInit {
  @Input() username: string = '';
  @Input() photoURL: string = '';
  @Input() name: string = '';

  u = {
    username: '',
    photoURL: '',
    name: ''
  }

  ngOnInit() {
    this.u.username = this.username;
    this.u.photoURL = this.photoURL;
    this.u.name = this.name;
  }
}
