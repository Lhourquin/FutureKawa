import { Injectable } from '@nestjs/common';
import { AlertDto } from './dto/alert.dto';
import { BrazilBackendClient } from '../shared/clients/brazil-backend.client';
import { CountryCatalogService } from '../shared/services/country-catalog.service';
import { CountryCode } from '../shared/enums/country-code.enum';

@Injectable()
export class AlertsService {
  constructor(
    private readonly countryCatalogService: CountryCatalogService,
    private readonly brazilBackendClient: BrazilBackendClient,
  ) {}

  async getAlerts(): Promise<AlertDto[]> {
    const countries = this.countryCatalogService.getAll();
    const remoteBrazilAlerts = await this.brazilBackendClient.getAlerts();
    const countriesByCode = new Map(
      countries.map((country) => [country.code, country]),
    );

    const brazilCountry = countriesByCode.get(CountryCode.BR);
    const normalizedBrazilAlerts = remoteBrazilAlerts.map((alert) => ({
      ...alert,
      countryCode: brazilCountry?.code ?? CountryCode.BR,
      countryName: brazilCountry?.name ?? 'Bresil',
    }));

    return normalizedBrazilAlerts.sort((left, right) =>
      right.detectedAt.localeCompare(left.detectedAt),
    );
  }
}
