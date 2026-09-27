import { QueryTypes } from 'sequelize';
import { sequelize } from '../db/index.js';

export const reportsRepository = {
  async equipmentLoad({ from, to, minRequests }) {
    const sql = `
      SELECT
        e.id,
        e.name,
        e.serial_number,
        COUNT(r.id)::int AS total_requests,
        COUNT(r.id) FILTER (WHERE r.status = 'done')::int AS closed_requests,
        COALESCE(SUM(ra.hours), 0)::numeric(10,2) AS planned_hours,
        MAX(r.closed_at) AS last_service_date
      FROM equipment e
      LEFT JOIN maintenance_requests r
        ON r.equipment_id = e.id
       AND (:from IS NULL OR r.created_at >= :from)
       AND (:to   IS NULL OR r.created_at <= :to)
      LEFT JOIN request_assignees ra ON ra.request_id = r.id
      GROUP BY e.id, e.name, e.serial_number
      HAVING COUNT(r.id) >= :minRequests
      ORDER BY total_requests DESC, e.name ASC
    `;

    return sequelize.query(sql, {
      replacements: { from, to, minRequests },
      type: QueryTypes.SELECT,
    });
  },
};
