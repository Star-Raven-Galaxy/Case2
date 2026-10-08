import { User, Technician } from '../db/index.js';

export const usersRepository = {
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  },

  async findById(id) {
    return User.findByPk(id, {
      include: [{ model: Technician, as: 'technician' }],
    });
  },

  async create(data) {
    return User.create(data);
  },

  async updateLastLogin(id) {
    return User.update({ lastLoginAt: new Date() }, { where: { id } });
  },
};