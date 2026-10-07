import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeStat } from '../../../../models/home-stat.model';

/** Presentational hero: emits the search term and lets the parent decide navigation. */
@Component({
  selector: 'app-hero-search',
  imports: [FormsModule],
  templateUrl: './hero-search.html',
  styleUrl: './hero-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSearch {
  readonly stats = input<HomeStat[]>([]);
  readonly search = output<string>();

  protected readonly term = signal('');

  onSubmit(): void {
    this.search.emit(this.term().trim());
  }
}
