// analytics.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaClient) {}

  async getAnalytics() {
    const solicitudesPorTipo = await this.prisma.$queryRaw`
      SELECT tipo, COUNT(*) as cantidad
      FROM SolicitudSoporte
      GROUP BY tipo
    `;

    const totalSolicitudesPorMes = await this.prisma.$queryRaw`
      SELECT 
        TO_CHAR(fechaReporte, 'Month') as mes,
        COUNT(*) as cantidad
      FROM SolicitudSoporte
      GROUP BY mes
      ORDER BY MIN(fechaReporte)
    `;

    const tiempoRespuesta = await this.prisma.$queryRaw`
      SELECT 
        TO_CHAR(fechaReporte, 'Month') as mes,
        AVG(EXTRACT(EPOCH FROM (fechaSolucion - fechaReporte))/60) as promedio
      FROM SolicitudSoporte
      WHERE fechaSolucion IS NOT NULL
      GROUP BY mes
      ORDER BY MIN(fechaReporte)
    `;

    const calificacionPromedio = await this.prisma.$queryRaw`
      SELECT 
        TO_CHAR(d.fechaCreacion, 'Month') as mes,
        AVG(d.calificacion) as promedio
      FROM Diagnostico d
      WHERE d.calificacion IS NOT NULL
      GROUP BY mes
      ORDER BY MIN(d.fechaCreacion)
    `;

    const usoApp = await this.prisma.$queryRaw`
      SELECT 
        DATE(fechaCreacion) as fecha,
        COUNT(DISTINCT usuarioId) as usuarios
      FROM Actividad
      GROUP BY fecha
      ORDER BY fecha
    `;

    return {
      solicitudesPorTipo,
      totalSolicitudesPorMes,
      tiempoRespuesta,
      calificacionPromedio,
      usoApp,
    };
  }
}