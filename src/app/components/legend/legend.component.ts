import { Component } from '@angular/core';
import { TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-legend',
  imports: [
    TranslatePipe
  ],
  templateUrl: './legend.component.html',
  standalone: true,
  styleUrl: './legend.component.css'
})
export class LegendComponent {

}
