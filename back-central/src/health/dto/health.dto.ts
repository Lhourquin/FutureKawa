import { ApiProperty } from '@nestjs/swagger';

export class HealthDto {
  @ApiProperty({
    description: "Statut technique de l'API.",
    example: 'ok',
  })
  status!: 'ok';

  @ApiProperty({
    description: 'Horodatage ISO de la reponse.',
    example: '2026-04-13T10:00:00.000Z',
  })
  timestamp!: string;
}
