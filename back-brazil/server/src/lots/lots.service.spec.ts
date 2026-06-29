import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringService } from '../shared/services/monitoring.service';
import { CLOCK } from '../shared/repositories/clock.repository';
import { LOT_REPOSITORY } from '../shared/repositories/lot.repository';
import { MEASUREMENT_REPOSITORY } from '../shared/repositories/measurement.repository';
import { LotsService } from './lots.service';

const FIXED_NOW = new Date('2026-06-18T12:00:00Z');

const makeLot = (id: string, storedAt: string) => ({
  id,
  reference: `REF-${id}`,
  warehouseId: 'entrepotA',
  warehouseName: 'Entrepôt A',
  countryCode: 'BR' as const,
  productName: 'Café',
  producer: 'Fazenda',
  harvestDate: '2025-01-01T00:00:00Z',
  storedAt,
  quantityKg: 100,
});

describe('LotsService', () => {
  let service: LotsService;

  const mockLotRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByWarehouseId: jest.fn(),
  };

  const mockMeasurementRepository = {
    findBySensor: jest.fn().mockResolvedValue([]),
    findLatestBySensor: jest.fn().mockResolvedValue(null),
    create: jest.fn(),
  };

  const mockClock = { now: () => FIXED_NOW };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LotsService,
        MonitoringService,
        { provide: LOT_REPOSITORY, useValue: mockLotRepository },
        {
          provide: MEASUREMENT_REPOSITORY,
          useValue: mockMeasurementRepository,
        },
        { provide: CLOCK, useValue: mockClock },
      ],
    }).compile();

    service = module.get<LotsService>(LotsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getLots — ordre FIFO', () => {
    it('trie les lots par storedAt ASC (premier entré, premier sorti)', async () => {
      const lots = [
        makeLot('lot-3', '2026-01-10T00:00:00Z'),
        makeLot('lot-1', '2025-06-01T00:00:00Z'),
        makeLot('lot-2', '2025-09-15T00:00:00Z'),
      ];
      // Le repository renvoie déjà trié (orderBy storedAt asc dans Prisma)
      mockLotRepository.findAll.mockResolvedValue(
        [...lots].sort((a, b) => a.storedAt.localeCompare(b.storedAt)),
      );

      const result = await service.getLots();

      expect(result[0].id).toBe('lot-1');
      expect(result[1].id).toBe('lot-2');
      expect(result[2].id).toBe('lot-3');
    });
  });

  describe('getLotDetail', () => {
    it('lève NotFoundException si le lot est introuvable', async () => {
      mockLotRepository.findById.mockResolvedValue(null);
      await expect(service.getLotDetail('inexistant')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('calcule storageDays correctement', async () => {
      mockLotRepository.findById.mockResolvedValue(
        makeLot('lot-br-002', '2025-06-17T00:00:00Z'),
      );
      const result = await service.getLotDetail('lot-br-002');
      expect(result.storageDays).toBe(366);
    });

    it('expose conditionsInRange = null si aucune mesure', async () => {
      mockLotRepository.findById.mockResolvedValue(
        makeLot('lot-1', '2025-06-01T00:00:00Z'),
      );
      mockMeasurementRepository.findLatestBySensor.mockResolvedValue(null);
      const result = await service.getLotDetail('lot-1');
      expect(result.conditionsInRange).toBeNull();
    });
  });
});
