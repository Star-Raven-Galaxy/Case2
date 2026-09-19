Программа для учёта заявок на техническое обслуживание оборудования производственной площадки (ветропарк).

## Описание

Сервис ведёт:

- Справочник оборудования — единицы с типом, серийным номером, координатами и статусом.
- Заявки на обслуживание — с жизненным циклом new → in_progress → done / rejected.
- Прогноз погоды — по координатам объекта, с признаком пригодности окна для наружных работ.

## Требования

- Node.js 18.0.0 или выше
- npm 9.0.0 или выше

Сервер запускается на  http://localhost:3000.

## Переменные окружения

 PORT -  Порт сервера: 3000 
 NODE_ENV - Окружение: development 
 LOG_LEVEL  Уровень логирования: info 
 CORS_ORIGINS  Разрешённые origin через запятую 
 RATE_LIMIT_WINDOW_MS - Окно rate limit (мс):  60000 
 RATE_LIMIT_MAX - Максимум запросов:  100 
 WEATHER_API_URL - URL погодного API  
 REQUEST_TIMEOUT_MS - Таймаут внешнего API:  5000 
 WIND_THRESHOLD_MS - Порог ветра для работ:  10 

## Эндпоинты
# Health
GET /api/health — проверка доступности сервиса

# Equipment
GET /api/equipment — список оборудования (фильтры, сортировка, пагинация)

POST /api/equipment — создание единицы оборудования

GET /api/equipment/:id — карточка оборудования

PATCH /api/equipment/:id — частичное обновление

DELETE /api/equipment/:id — удаление (запрещено при открытых заявках)

GET /api/equipment/:id/requests — заявки по конкретному оборудованию

GET /api/equipment/:id/weather — прогноз по координатам и пригодность окна для наружных работ

# Requests
GET /api/requests — список заявок (фильтры, сортировка, пагинация)

POST /api/requests — создание заявки

GET /api/requests/:id — карточка заявки

PATCH /api/requests/:id — редактирование полей заявки

PATCH /api/requests/:id/status — смена статуса с проверкой допустимости перехода

DELETE /api/requests/:id — удаление заявки

## Модель данных
# Equipment
id — string: UUID, генерируется сервером

name — string: 3–100 символов, обязательное

type — enum: turbine / inverter / sensor / substation

serialNumber — string: уникальный в системе

location — object: { lat: -90…90, lon: -180…180 }

status — enum: operational / maintenance / fault / decommissioned

installedAt — ISO-дата: не в будущем

createdAt — ISO-дата: проставляется сервером

updatedAt — ISO-дата: проставляется сервером

# Maintenance Request
id — string: UUID, генерируется сервером

equipmentId — string: UUID существующего оборудования

title — string: 5–120 символов, обязательное

description — string: до 2000 символов, опционально

priority — enum: low / medium / high / critical

status — enum: new / in_progress / done / rejected (по умолчанию new)

plannedAt — ISO-дата-время: опционально

createdAt — ISO-дата-время: проставляется сервером

updatedAt — ISO-дата-время: проставляется сервером

