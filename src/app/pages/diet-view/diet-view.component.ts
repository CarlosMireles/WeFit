import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DietService } from '../../services/diet.service';
import  {Diet, Meal} from '../../models/diet';

@Component({
  selector: 'app-diet-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './diet-view.component.html',
  styleUrls: ['./diet-view.component.css']
})
export class DietViewComponent implements OnInit {
  diet!: Diet;
  editMode = false;
  saving = false;
  updated: Diet = { id: '', title: '', description1: '', meals: [] };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dietService: DietService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { await this.router.navigate(['/diets']); return; }
    const d = await this.dietService.getDietById(id);
    if (!d) { await this.router.navigate(['/diets']); return; }
    this.diet = d;
    this.updated = JSON.parse(JSON.stringify(d));
  }

  toggleEdit(): void {
    this.editMode = true;
  }

  async saveEdit(): Promise<void> {
    if (!this.diet.id) return;

    // Comprobamos nombre+descripción en cada comida
    const bad = this.updated.meals.find(m =>
      !m.lunch.trim() || !m.description2.trim()
    );
    if (bad) {
      alert('Cada comida debe tener Nombre y Descripción.');
      return;
    }

    this.saving = true;
    try {
      const mealsToSave = this.updated.meals.map(m => {
        const clean: any = {
          lunch: m.lunch,
          description2: m.description2
        };
        if (m.proteins != null)      clean.proteins = m.proteins;
        if (m.carbohydrates != null) clean.carbohydrates = m.carbohydrates;
        if (m.fats != null)          clean.fats = m.fats;
        if (m.calories != null)      clean.calories = m.calories;
        if (m.img_url)               clean.img_url = m.img_url;
        return clean;
      });
      await this.dietService.updateDiet(this.diet.id, {
        title: this.updated.title,
        description1: this.updated.description1,
        meals: mealsToSave
      });
      this.diet = { ...this.updated, meals: mealsToSave as Meal[] };
      this.editMode = false;
    } finally {
      this.saving = false;
    }
  }

  async deleteDiet(): Promise<void> {
    if (!this.diet.id) return;
    if (!confirm('¿Eliminar esta dieta?')) return;
    await this.dietService.deleteDiet(this.diet.id);
    await this.router.navigate(['/diets']);
  }

  cancel(): void {
    if (this.editMode) {
      this.updated = JSON.parse(JSON.stringify(this.diet));
      this.editMode = false;
    } else {
      this.router.navigate(['/diets']);
    }
  }

  addMeal(): void {
    if (this.updated.meals.length >= 10) return;
    this.updated.meals = [
      ...this.updated.meals,
      {
        lunch: '',
        description2: '',
        proteins: undefined,
        carbohydrates: undefined,
        fats: undefined,
        calories: undefined,
        img_url: undefined
      }
    ];
    this.cdr.detectChanges();
  }

  removeMeal(i: number): void {
    if (this.updated.meals.length <= 1) return;
    this.updated.meals = this.updated.meals.filter((_, idx) => idx !== i);
    this.cdr.detectChanges();
  }

  onFileSelected(event: Event, meal: Meal): void {
    const inp = event.target as HTMLInputElement;
    if (inp.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => (meal.img_url = reader.result as string);
      reader.readAsDataURL(inp.files[0]);
    }
  }
}
