import {
  Body, Controller, Delete, Get, HttpCode, Param, ParseEnumPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse,
  ApiOkResponse, ApiOperation, ApiParam, ApiTags,
} from '@nestjs/swagger';
import { CountryOwnerGuard } from '../auth/country-owner.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { WarehouseOverviewDto } from './dto/warehouse-overview.dto';
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

  @Get(':countryCode/warehouses')
  @ApiOperation({ summary: "Vue consolidée des entrepôts d'un pays" })
  @ApiParam({ name: 'countryCode', enum: CountryCode })
  @ApiOkResponse({ type: WarehouseOverviewDto, isArray: true })
  getWarehouses(
    @Param('countryCode', new ParseEnumPipe(CountryCode)) countryCode: CountryCode,
  ): Promise<unknown[]> {
    return this.countriesService.getWarehouses(countryCode);
  }

  @Post(':countryCode/lots')
  @HttpCode(201)
  @Roles('operator')
  @UseGuards(RolesGuard, CountryOwnerGuard)
  @ApiOperation({ summary: 'Créer un lot pour un pays' })
  @ApiParam({ name: 'countryCode', enum: CountryCode })
  @ApiCreatedResponse()
  createLot(
    @Param('countryCode', new ParseEnumPipe(CountryCode)) countryCode: CountryCode,
    @Body() body: unknown,
  ): Promise<unknown> {
    return this.countriesService.createLot(countryCode, body);
  }

  @Patch(':countryCode/lots/:lotId')
  @Roles('operator')
  @UseGuards(RolesGuard, CountryOwnerGuard)
  @ApiOperation({ summary: 'Modifier un lot' })
  @ApiParam({ name: 'countryCode', enum: CountryCode })
  @ApiParam({ name: 'lotId' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  updateLot(
    @Param('countryCode', new ParseEnumPipe(CountryCode)) countryCode: CountryCode,
    @Param('lotId') lotId: string,
    @Body() body: unknown,
  ): Promise<unknown> {
    return this.countriesService.updateLot(countryCode, lotId, body);
  }

  @Delete(':countryCode/lots/:lotId')
  @HttpCode(204)
  @Roles('operator')
  @UseGuards(RolesGuard, CountryOwnerGuard)
  @ApiOperation({ summary: 'Supprimer un lot (cascade mesures IoT)' })
  @ApiParam({ name: 'countryCode', enum: CountryCode })
  @ApiParam({ name: 'lotId' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  deleteLot(
    @Param('countryCode', new ParseEnumPipe(CountryCode)) countryCode: CountryCode,
    @Param('lotId') lotId: string,
  ): Promise<void> {
    return this.countriesService.deleteLot(countryCode, lotId);
  }
}
