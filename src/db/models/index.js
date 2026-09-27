import { sequelize } from '../sequelize.js';
import { initSite } from './site.model.js';
import { initEquipment } from './equipment.model.js';
import { initEquipmentPassport } from './equipment-passport.model.js';
import { initTechnician } from './technician.model.js';
import { initMaintenanceRequest } from './maintenance-request.model.js';
import { initRequestStatusHistory } from './request-status-history.model.js';
import { initRequestAssignee } from './request-assignee.model.js';

const Site = initSite(sequelize);
const Equipment = initEquipment(sequelize);
const EquipmentPassport = initEquipmentPassport(sequelize);
const Technician = initTechnician(sequelize);
const MaintenanceRequest = initMaintenanceRequest(sequelize);
const RequestStatusHistory = initRequestStatusHistory(sequelize);
const RequestAssignee = initRequestAssignee(sequelize);

const models = {
  Site,
  Equipment,
  EquipmentPassport,
  Technician,
  MaintenanceRequest,
  RequestStatusHistory,
  RequestAssignee,
};

// Регистрация ассоциаций
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { models };
export {
  Site,
  Equipment,
  EquipmentPassport,
  Technician,
  MaintenanceRequest,
  RequestStatusHistory,
  RequestAssignee,
};