import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../../core/services/loading/loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    // Initialize the loading$ observable here, for example:
    this.loading$ = this.loadingService.loading$;
  }
}
