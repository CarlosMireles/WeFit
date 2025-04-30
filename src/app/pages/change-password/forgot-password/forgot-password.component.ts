import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageService} from '../../../services/translate.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './forgot-password.component.html',
  standalone: true,
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  user = {
    email: ''
  };

  userService: UserService = inject(UserService);

  constructor(private router: Router, private langService: LanguageService) {}

  async ngOnInit() {
    const lang = this.langService.currentLang;
    await this.langService.changeLang(lang);
  }

  onSubmit(form: any) {
    this.user.email = form.value.email;
    this.userService.resetPassword(this.user.email);
    form.resetFields();
    this.router.navigate(['/login']);
  }
}
