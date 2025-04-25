import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserSearchComponent } from './pages/user-search/user-search.component';
// Importa tu nuevo componente de búsqueda de perfil
import { ProfileSearchComponent } from './pages/profile-search/profile-search.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'userProfile', component: UserProfileComponent },
  { path: 'user-search', component: UserSearchComponent },
  // Nueva ruta para profile-search recibiendo el UID o username
  { path: 'profile-search/:profileUid', component: ProfileSearchComponent }
];
