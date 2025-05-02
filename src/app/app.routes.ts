import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserSearchComponent } from './pages/user-search/user-search.component';
import { ProfileSearchComponent } from './pages/profile-search/profile-search.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import {ForgotPasswordComponent} from './pages/change-password/forgot-password/forgot-password.component';
import { DietsComponent } from './pages/diets/diets.component';
import { NewDietComponent } from './pages/new-diet/new-diet.component';
import { DietViewComponent } from './pages/diet-view/diet-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'userProfile', component: UserProfileComponent },
  { path: 'user-search', component: UserSearchComponent },
  { path: 'diets', component: DietsComponent },
  { path: 'new-diet', component: NewDietComponent },
  { path: 'diet-view/:id', component: DietViewComponent },
  { path: 'profile-search/:profileUid', component: ProfileSearchComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
];
