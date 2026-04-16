import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // upsert : crée les lots s'ils n'existent pas, met à jour sinon.
  // Ne touche PAS aux mesures existantes → relancer le seed avant la démo est sans risque.
  const lots = [
    {
      id: 'lot-br-001',
      reference: 'BR-2025-001',
      warehouseId: 'entrepotA',
      warehouseName: 'Entrepôt A',
      countryCode: 'BR',
      productName: 'Arabica Santos',
      producer: 'Cooperativa Vale Verde',
      harvestDate: new Date('2025-05-12T00:00:00.000Z'),
      storedAt: new Date('2025-06-01T09:00:00.000Z'),
      quantityKg: 1200,
    },
    {
      id: 'lot-br-002',
      reference: 'BR-2024-014',
      warehouseId: 'entrepotA',
      warehouseName: 'Entrepôt A',
      countryCode: 'BR',
      productName: 'Bourbon Jaune',
      producer: 'Fazenda Aurora',
      harvestDate: new Date('2024-02-18T00:00:00.000Z'),
      storedAt: new Date('2025-05-10T08:30:00.000Z'),
      quantityKg: 860,
    },
  ];

  for (const lot of lots) {
    await prisma.lot.upsert({ where: { id: lot.id }, create: lot, update: lot });
  }

  // Pas de mesures insérées : les vraies mesures arrivent via MQTT (ESP32 → MqttDebugService)
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
