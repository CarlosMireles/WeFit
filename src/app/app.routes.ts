import {RouterModule, Routes} from '@angular/router';
import { searchBarComponent } from './searchBar/app.searchBar';
import { EjemploComponent } from './ejemplo/ejemplo.component';
import { AuthGuard } from '../guards/auth.guard';
import {NgModule} from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: searchBarComponent, canActivate: [AuthGuard] },
  { path: 'ejemplo', component: EjemploComponent },
  { path: '**', redirectTo: 'ejemplo' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
