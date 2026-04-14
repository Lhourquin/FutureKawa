import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CountryDto } from './dto/country.dto';
import { CountryOverviewDto } from './dto/country-overview.dto';
import { LotSummaryDto } from './dto/lot-summary.dto';
import { CountryCode } from '../shared/enums/country-code.enum';
import { Country } from '../shared/models/country.model';
import { BrazilBackendClient } from '../shared/clients/brazil-backend.client';
import { CountryCatalogService } from '../shared/services/country-catalog.service';

@Injectable()
export class CountriesService {
  constructor(
    private readonly countryCatalogService: CountryCatalogService,
    private readonly brazilBackendClient: BrazilBackendClient,
  ) {}

  async getCountries(): Promise<CountryDto[]> {
    const countries = this.countryCatalogService.getAll();
    return countries.map((country) => ({
      code: country.code,
      name: country.name,
      targetTemperatureC: country.targetProfile.targetTemperatureC,
      targetHumidityPercent: country.targetProfile.targetHumidityPercent,
      temperatureToleranceC: country.targetProfile.temperatureToleranceC,
      humidityTolerancePercent: country.targetProfile.humidityTolerancePercent,
    }));
  }

  async getCountryOverview(countryCode: CountryCode): Promise<CountryOverviewDto> {
    const country = this.getCountryOrFail(countryCode);
    const lots = await this.getLotsByCountry(countryCode);
    const latestValues = lots.filter(
      (lot) => lot.latestTemperatureC !== null && lot.latestHumidityPercent !== null,
    );

    return {
      countryCode: country.code,
      countryName: country.name,
      totalLots: lots.length,
      lotsInRange: lots.filter((lot) => lot.conditionsInRange === true).length,
      lotsOutOfRange: lots.filter((lot) => lot.conditionsInRange === false).length,
      lotsStoredOver365Days: lots.filter((lot) => lot.storageDays > 365).length,
      averageLatestTemperatureC:
        latestValues.length > 0
          ? Number(
              (
                latestValues.reduce(
                  (sum, lot) => sum + (lot.latestTemperatureC ?? 0),
                  0,
                ) / latestValues.length
              ).toFixed(1),
            )
          : null,
      averageLatestHumidityPercent:
        latestValues.length > 0
          ? Number(
              (
                latestValues.reduce(
                  (sum, lot) => sum + (lot.latestHumidityPercent ?? 0),
                  0,
                ) / latestValues.length
              ).toFixed(1),
            )
          : null,
    };
  }

  async getLotsByCountry(countryCode: CountryCode): Promise<LotSummaryDto[]> {
    if (countryCode === CountryCode.BR) {
      return this.brazilBackendClient.getLots();
    }

    throw new BadGatewayException(
      `Country backend ${countryCode} is not available yet`,
    );
  }

  private getCountryOrFail(countryCode: CountryCode): Country {
    const country = this.countryCatalogService.getByCode(countryCode);
    if (!country) {
      throw new NotFoundException(`Country ${countryCode} not found`);
    }

    return country;
  }
}
