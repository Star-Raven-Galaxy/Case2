export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Equipment Maintenance API',
    version: '1.0.0',
    description:
      'Сервис учёта заявок на обслуживание оборудования. Аутентификация по JWT (Bearer), роли: viewer, technician, admin.',
  },
  servers: [{ url: '/api', description: 'API (через Nginx)' }],
  tags: [
    { name: 'Auth', description: 'Регистрация и вход' },
    { name: 'Equipment', description: 'Оборудование' },
    { name: 'Requests', description: 'Заявки' },
    { name: 'Sites', description: 'Площадки' },
    { name: 'Reports', description: 'Отчёты' },
    { name: 'Health', description: 'Проверки доступности' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Некорректные данные запроса' },
              requestId: { type: 'string', format: 'uuid' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
      RegisterBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', minLength: 8, example: 'Passw0rd!' },
          role: { type: 'string', enum: ['viewer', 'technician', 'admin'] },
          technicianId: { type: 'string', format: 'uuid', nullable: true },
        },
      },
      LoginBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              accessToken: { type: 'string' },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['viewer', 'technician', 'admin'] },
          technicianId: { type: 'string', nullable: true },
          isActive: { type: 'boolean' },
          lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Equipment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          siteId: { type: 'string', format: 'uuid', nullable: true },
          name: { type: 'string' },
          type: { type: 'string', enum: ['turbine', 'inverter', 'sensor', 'substation'] },
          serialNumber: { type: 'string' },
          status: { type: 'string', enum: ['operational', 'maintenance', 'fault', 'decommissioned'] },
          installedAt: { type: 'string', format: 'date-time' },
          location: {
            type: 'object',
            properties: { lat: { type: 'number' }, lon: { type: 'number' } },
          },
        },
      },
      Request: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          equipmentId: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          status: { type: 'string', enum: ['new', 'in_progress', 'done', 'rejected'] },
          plannedAt: { type: 'string', format: 'date-time', nullable: true },
          closedAt: { type: 'string', format: 'date-time', nullable: true },
          author: { type: 'string' },
        },
      },
      AssigneesBody: {
        type: 'object',
        required: ['assignees'],
        properties: {
          assignees: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['technicianId', 'role'],
              properties: {
                technicianId: { type: 'string', format: 'uuid' },
                role: { type: 'string', enum: ['lead', 'member'] },
                hours: { type: 'number', minimum: 0 },
              },
            },
          },
        },
      },
      SiteSummary: {
        type: 'object',
        properties: {
          siteId: { type: 'string', format: 'uuid' },
          byStatus: {
            type: 'array',
            items: {
              type: 'object',
              properties: { status: { type: 'string' }, count: { type: 'integer' } },
            },
          },
          byPriority: {
            type: 'array',
            items: {
              type: 'object',
              properties: { priority: { type: 'string' }, count: { type: 'integer' } },
            },
          },
          avgCloseHours: { type: 'string', nullable: true },
        },
      },
      EquipmentLoad: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            serial_number: { type: 'string' },
            total_requests: { type: 'integer' },
            closed_requests: { type: 'integer' },
            planned_hours: { type: 'string' },
            last_service_date: { type: 'string', format: 'date-time', nullable: true },
          },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Регистрация пользователя',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } } },
        },
        responses: {
          201: { description: 'Пользователь создан' },
          409: { description: 'Email уже зарегистрирован', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          422: { description: 'Ошибка валидации' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Вход, выдача access-токена и refresh-cookie',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } },
        },
        responses: {
          200: { description: 'Успешный вход', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
          401: { description: 'Неверный email или пароль' },
          429: { description: 'Слишком много попыток' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Обновление access-токена по refresh-cookie',
        security: [],
        responses: {
          200: { description: 'Новый access-токен' },
          401: { description: 'Нет или невалидный refresh-токен' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Выход — удаление refresh-cookie',
        security: [],
        responses: { 204: { description: 'OK' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Текущий пользователь',
        responses: {
          200: { description: 'Пользователь', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Не авторизован' },
        },
      },
    },
    '/equipment': {
      get: {
        tags: ['Equipment'],
        summary: 'Список оборудования',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 100 } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: { 200: { description: 'Список' } },
      },
      post: {
        tags: ['Equipment'],
        summary: 'Создание единицы оборудования (admin)',
        responses: { 201: { description: 'Создано' }, 403: { description: 'Недостаточно прав' } },
      },
    },
    '/equipment/{id}': {
      get: {
        tags: ['Equipment'],
        summary: 'Карточка оборудования',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Оборудование' }, 404: { description: 'Не найдено' } },
      },
      patch: {
        tags: ['Equipment'],
        summary: 'Обновление (admin)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'OK' }, 403: { description: 'Forbidden' } },
      },
      delete: {
        tags: ['Equipment'],
        summary: 'Удаление (admin, запрещено при открытых заявках)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 204: { description: 'OK' }, 409: { description: 'Есть открытые заявки' } },
      },
    },
    '/requests': {
      get: {
        tags: ['Requests'],
        summary: 'Список заявок',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 100 } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'priority', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Список' } },
      },
      post: {
        tags: ['Requests'],
        summary: 'Создание заявки (technician, admin)',
        responses: { 201: { description: 'Создано' }, 403: { description: 'Forbidden' } },
      },
    },
    '/requests/{id}': {
      get: {
        tags: ['Requests'],
        summary: 'Карточка заявки',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Заявка' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Requests'],
        summary: 'Редактирование заявки',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'OK' }, 403: { description: 'Forbidden' } },
      },
      delete: {
        tags: ['Requests'],
        summary: 'Удаление заявки (admin)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 204: { description: 'OK' } },
      },
    },
    '/requests/{id}/status': {
      patch: {
        tags: ['Requests'],
        summary: 'Смена статуса (technician — только свои заявки)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: { status: { type: 'string', enum: ['new', 'in_progress', 'done', 'rejected'] } },
              },
            },
          },
        },
        responses: {
          200: { description: 'OK' },
          403: { description: 'Не назначен на заявку' },
          409: { description: 'Недопустимый переход / нет исполнителей' },
        },
      },
    },
    '/requests/{id}/assignees': {
      post: {
        tags: ['Requests'],
        summary: 'Назначение бригады (admin)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AssigneesBody' } } },
        },
        responses: {
          200: { description: 'OK' },
          404: { description: 'Специалист не найден' },
          422: { description: 'Не ровно один lead' },
        },
      },
    },
    '/requests/{id}/assignees/{userId}': {
      delete: {
        tags: ['Requests'],
        summary: 'Снятие специалиста (admin)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'userId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { 204: { description: 'OK' }, 404: { description: 'Not found' } },
      },
    },
    '/requests/{id}/history': {
      get: {
        tags: ['Requests'],
        summary: 'История статусов заявки',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Список записей журнала' } },
      },
    },
    '/sites/{id}/summary': {
      get: {
        tags: ['Sites'],
        summary: 'Сводка по площадке',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: {
            description: 'Сводка',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SiteSummary' } } },
          },
        },
      },
    },
    '/reports/equipment-load': {
      get: {
        tags: ['Reports'],
        summary: 'Нагрузка на оборудование (raw SQL)',
        parameters: [
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date-time' } },
          { name: 'minRequests', in: 'query', schema: { type: 'integer', minimum: 0, maximum: 1000 } },
        ],
        responses: {
          200: {
            description: 'Отчёт',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/EquipmentLoad' } } },
          },
        },
      },
    },
    '/health/live': {
      get: { tags: ['Health'], summary: 'Liveness probe', security: [], responses: { 200: { description: 'OK' } } },
    },
    '/health/ready': {
      get: { tags: ['Health'], summary: 'Readiness probe (проверяет БД)', security: [], responses: { 200: { description: 'Ready' }, 503: { description: 'Not ready' } } },
    },
  },
};
