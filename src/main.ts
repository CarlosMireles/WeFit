import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { searchBarComponent } from './app/searchBar/app.searchBar';

bootstrapApplication(searchBarComponent, appConfig)
  .catch((err) => console.error(err));
