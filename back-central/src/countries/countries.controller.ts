import { Controller, Get, Param, ParseEnumPipe } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CountryCode } from '../shared/enums/country-code.enum';
import { CountriesService } from './countries.service';
import { CountryDto } from './dto/country.dto';
import { CountryOverviewDto } from './dto/country-overview.dto';
import { LotSummaryDto } from './dto/lot-summary.dto';

@ApiTags('Pays')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les pays suivis par le siege',
    description:
      "Retourne les pays geres par l'API centrale avec leurs cibles de temperature et d'humidite. Cet endpoint sert a alimenter les vues de reference et les filtres pays dans les interfaces de supervision.",
  })
  @ApiOkResponse({
    description: 'Liste des pays avec leurs seuils cibles.',
    type: CountryDto,
    isArray: true,
  })
  getCountries(): Promise<CountryDto[]> {
    return this.countriesService.getCountries();
  }

  @Get(':countryCode/overview')
  @ApiOperation({
    summary: "Obtenir la vue consolidee d'un pays",
    description:
      "Retourne les indicateurs consolides d'un pays: nombre de lots, lots dans la plage cible, lots hors plage et moyenne des dernieres mesures. Cet endpoint sert au pilotage global par pays depuis le siege.",
  })
  @ApiParam({
    name: 'countryCode',
    enum: CountryCode,
    description: 'Code pays a consulter: BR, EC ou CO.',
  })
  @ApiOkResponse({
    description: 'Vue consolidee du pays demande.',
    type: CountryOverviewDto,
  })
  @ApiNotFoundResponse({
    description: 'Le pays demande n existe pas dans le referentiel.',
  })
  getCountryOverview(
    @Param('countryCode', new ParseEnumPipe(CountryCode))
    countryCode: CountryCode,
  ): Promise<CountryOverviewDto> {
    return this.countriesService.getCountryOverview(countryCode);
  }

  @Get(':countryCode/lots')
  @ApiOperation({
    summary: "Lister les lots d'un pays",
    description:
      "Retourne la liste des lots rattaches a un pays, avec leur dernier etat connu et leur anciennete de stockage. Cet endpoint sert a passer d'une vue consolidee a une vue operationnelle pays par pays.",
  })
  @ApiParam({
    name: 'countryCode',
    enum: CountryCode,
    description: 'Code pays a consulter: BR, EC ou CO.',
  })
  @ApiOkResponse({
    description: 'Liste des lots pour le pays demande.',
    type: LotSummaryDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Le pays demande n existe pas dans le referentiel.',
  })
  getLotsByCountry(
    @Param('countryCode', new ParseEnumPipe(CountryCode))
    countryCode: CountryCode,
  ): Promise<LotSummaryDto[]> {
    return this.countriesService.getLotsByCountry(countryCode);
  }
}
