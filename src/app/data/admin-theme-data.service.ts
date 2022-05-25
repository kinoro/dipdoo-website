import { Injectable } from '@angular/core';
import { DataService } from './base/data.service';
import { Observable } from 'rxjs';
import { SharedDataService } from './base/shared-data.service';
import { Theme } from '../models/theme';

@Injectable({
  providedIn: 'root'
})
export class AdminThemeDataService extends DataService {

    constructor(
        sharedData: SharedDataService
    ) { super(sharedData); }

    public async getUpcomingThemes(): Promise<Array<Theme>> {
        return await this.sharedData.get<Array<Theme>>(`${this.baseUrl}/admin/theme/upcoming`, this.options());
    }

    public async regenerate(theme: Theme): Promise<Theme> {
        return await this.sharedData.post<Theme>(`${this.baseUrl}/admin/theme/regenerate`, theme, this.options());
    }

    public async update(theme: Theme): Promise<Theme> {
        return await this.sharedData.post<Theme>(`${this.baseUrl}/admin/theme/update`, theme, this.options());
    }
}
