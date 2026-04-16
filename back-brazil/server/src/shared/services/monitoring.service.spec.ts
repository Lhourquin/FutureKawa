import { MonitoringService } from './monitoring.service';

describe('MonitoringService', () => {
  let service: MonitoringService;

  beforeEach(() => {
    service = new MonitoringService();
  });

  // --- computeStorageDays ---

  describe('computeStorageDays', () => {
    it('retourne 0 si storedAt = now', () => {
      const now = new Date('2026-06-18T12:00:00Z');
      expect(service.computeStorageDays('2026-06-18T12:00:00Z', now)).toBe(0);
    });

    it('retourne 365 après exactement 365 jours', () => {
      const storedAt = '2025-06-18T00:00:00Z';
      const now = new Date('2026-06-18T00:00:00Z');
      expect(service.computeStorageDays(storedAt, now)).toBe(365);
    });

    it('retourne 366 après 366 jours', () => {
      const storedAt = '2025-06-17T00:00:00Z';
      const now = new Date('2026-06-18T00:00:00Z');
      expect(service.computeStorageDays(storedAt, now)).toBe(366);
    });

    it('retourne 0 si storedAt est dans le futur (lot mal daté)', () => {
      const storedAt = '2027-01-01T00:00:00Z';
      const now = new Date('2026-06-18T00:00:00Z');
      expect(service.computeStorageDays(storedAt, now)).toBe(0);
    });
  });

  // --- isTemperatureInRange (Brésil : 29°C ±3°C → [26, 32]) ---

  describe('isTemperatureInRange', () => {
    it('accepte la valeur cible 29°C', () => {
      expect(service.isTemperatureInRange(29)).toBe(true);
    });

    it('accepte la borne basse 26°C', () => {
      expect(service.isTemperatureInRange(26)).toBe(true);
    });

    it('accepte la borne haute 32°C', () => {
      expect(service.isTemperatureInRange(32)).toBe(true);
    });

    it('rejette 25.9°C (sous le seuil bas)', () => {
      expect(service.isTemperatureInRange(25.9)).toBe(false);
    });

    it('rejette 32.1°C (au-dessus du seuil haut)', () => {
      expect(service.isTemperatureInRange(32.1)).toBe(false);
    });
  });

  // --- isHumidityInRange (Brésil : 55% ±2% → [53, 57]) ---

  describe('isHumidityInRange', () => {
    it('accepte la valeur cible 55%', () => {
      expect(service.isHumidityInRange(55)).toBe(true);
    });

    it('accepte la borne basse 53%', () => {
      expect(service.isHumidityInRange(53)).toBe(true);
    });

    it('accepte la borne haute 57%', () => {
      expect(service.isHumidityInRange(57)).toBe(true);
    });

    it('rejette 52.9%', () => {
      expect(service.isHumidityInRange(52.9)).toBe(false);
    });

    it('rejette 57.1%', () => {
      expect(service.isHumidityInRange(57.1)).toBe(false);
    });
  });

  // --- isWithinBrazilRange ---

  describe('isWithinBrazilRange', () => {
    it('retourne true si temp ET humidité dans la plage', () => {
      expect(service.isWithinBrazilRange(29, 55)).toBe(true);
    });

    it('retourne false si température hors plage', () => {
      expect(service.isWithinBrazilRange(33, 55)).toBe(false);
    });

    it('retourne false si humidité hors plage', () => {
      expect(service.isWithinBrazilRange(29, 58)).toBe(false);
    });

    it('retourne null si la température est inconnue', () => {
      expect(service.isWithinBrazilRange(null, 55)).toBeNull();
    });

    it("retourne null si l'humidite est inconnue", () => {
      expect(service.isWithinBrazilRange(29, null)).toBeNull();
    });

    it('retourne null si les deux sont inconnues', () => {
      expect(service.isWithinBrazilRange(null, null)).toBeNull();
    });
  });
});
