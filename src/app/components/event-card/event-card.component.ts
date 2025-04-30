import { Component } from '@angular/core';
import {LanguageService} from '../../services/translate.service';

@Component({
    selector: 'app-event-card',
    imports: [],
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

  @Output() selected = new EventEmitter<{
    id: string;
    latitude: number;
    longitude: number;
  }>();

  constructor(private langService: LanguageService, private router: Router) {}

  async ngOnInit() {
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
