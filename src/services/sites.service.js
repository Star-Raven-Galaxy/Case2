import { sitesRepository } from '../repositories/sites.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const sitesService = {
  async summary(id) {
    const site = await sitesRepository.findById(id);
    if (!site) throw new NotFoundError('Площадка');
    return sitesRepository.summary(id);
  },
};
