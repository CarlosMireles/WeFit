import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LanguageService} from '../../services/translate.service';
import { Router } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-event-card',
  imports: [
    TranslatePipe
  ],
    templateUrl: './event-card.component.html',
    standalone: true,
    styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() place!: string;
  @Input() date!: string;
  @Input() hour!: string;
  @Input() participants!: number;
  @Input() maxParticipants!: number;
  @Input() latitude!: number;
  @Input() longitude!: number;
  @Input() image!: string;
  image_route: string = "";

  @Output() selected = new EventEmitter<{
    id: string;
    latitude: number;
    longitude: number;
  }>();

  constructor(private langService: LanguageService, private router: Router) {}

  async ngOnInit() {
    this.image_route = "assets/sports/" + this.image + ".jpg";
    console.log(this.image_route);
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  onCardClick() {
    // 1) Emitimos la selección para que el mapa lo recoja
    this.selected.emit({
      id: this.id,
      latitude: this.latitude,
      longitude: this.longitude
    });

    // 2) Navegamos al mapa donde el MapComponent está suscrito a eventSelected$
    this.router.navigate(['/home']);
  }

}
