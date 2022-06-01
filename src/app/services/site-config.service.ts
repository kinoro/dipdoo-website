import { Injectable } from "@angular/core";
import { SiteConfigDataService } from "../data/site-config-data.service";
import { SiteConfig } from "../models/site-config";

@Injectable({
    providedIn: 'root'
})
export class SiteConfigService {
    private siteConfig: SiteConfig;

    constructor(private siteConfigData: SiteConfigDataService) {}

    async get() {
        if (this.siteConfig == null) {
            this.siteConfig = await this.siteConfigData.get();
        }

        return this.siteConfig;
    }
}