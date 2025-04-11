import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-search-bar',
    imports: [
        NgOptimizedImage,
        RouterLink
    ],
    templateUrl: './search-bar.component.html',
    standalone: true,
    styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

}
