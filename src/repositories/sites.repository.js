import { QueryTypes } from 'sequelize';
import { sequelize, Site, Equipment } from '../db/index.js';

export const sitesRepository = {
  async findById(id) {
    return Site.findByPk(id, {
      include: [
        {
          model: Equipment,
          as: 'equipment',
          attributes: ['id', 'name', 'status'],
        },
      ],
    });
  },

  async summary(id) {
    const [byStatus, byPriority, avgClose] = await Promise.all([
      sequelize.query(
        `SELECT r.status, COUNT(*)::int AS count
         FROM maintenance_requests r
         JOIN equipment e ON e.id = r.equipment_id
         WHERE e.site_id = :siteId
         GROUP BY r.status
         ORDER BY r.status`,
        { replacements: { siteId: id }, type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT r.priority, COUNT(*)::int AS count
         FROM maintenance_requests r
         JOIN equipment e ON e.id = r.equipment_id
         WHERE e.site_id = :siteId
         GROUP BY r.priority
         ORDER BY r.priority`,
        { replacements: { siteId: id }, type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT AVG(EXTRACT(EPOCH FROM (r.closed_at - r.created_at)) / 3600)::numeric(10,2) AS avg_hours
         FROM maintenance_requests r
         JOIN equipment e ON e.id = r.equipment_id
         WHERE e.site_id = :siteId AND r.closed_at IS NOT NULL`,
        { replacements: { siteId: id }, type: QueryTypes.SELECT }
      ),
    ]);

    return {
      siteId: id,
      byStatus,
      byPriority,
      avgCloseHours: avgClose[0]?.avg_hours ?? null,
    };
  },
};
