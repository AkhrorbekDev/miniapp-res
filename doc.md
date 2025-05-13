## 📚 API-документация Forkies (Frontend)

### URL https://miniapp.forkies.ru/api/

### 🧾 Аутентификация

#### `POST /auth/sad7JHV4dHjkbK7df/`
Авторизация через Telegram WebApp.

**Тело запроса:**
```json
{ "initData": "<строка из Telegram.WebApp.initData>" }
```

**Ответ:**
```json
{
  "success": true,
  "telegram_id": 123456,
  "username": "kproger",
  "access": "...",
  "refresh": "..."
}
```


---
### 🧭 Позиционирование в мини-приложении

#### `GET /onboarding/position/`
Получить текущую позицию пользователя в процессе онбординга.

**Ответ:**
```json
{ "position": 3 }
```

#### `PATCH /onboarding/position/`
Обновить текущую позицию пользователя в процессе онбординга (например: 1 — приветствие, 2–4 — анкета и т.д.).

**Тело запроса:**
```json
{ "position": 3 }
```

**Ответ:**
```json
{ "success": true, "position": 3 }
```

---

### 🧑‍💼 Анкета

#### `GET /questionnaire/`
Получить текущую анкету пользователя (или создать новую).

#### `PATCH /questionnaire/`
Обновить анкету.

**Тело запроса (частичное обновление):**
```json
{
  "age": 30
}
```

Файл `photo` загружается как `multipart/form-data`.

#### `GET /questionnaire/dictionaries/`
Справочники для анкеты: страны, города, семейное положение, статус с детьми и профессии.

**Ответ:**
```json
{
  "countries": [{"id": 1, "name": "Россия"}, ...],
  "cities": [{"id": 5, "name": "Москва", "country": 1}, ...],
  ...
}
```

---

### 📆 Мероприятия

#### `GET /events/`
Список всех предстоящих мероприятий (сортировка по дате).

**Ответ:**
```json
[
  {
    "id": 1,
    "date": "2025-05-05T18:00:00Z",
    "price": "1500.00"
  }
]
```

#### `POST /events/register/`
Запись на мероприятие.

**Тело запроса:**
```json
{ "event_id": 1 }
```

**Ответ:**
```json
{
  "success": true,
  "created": true,
  "event_id": 1,
  "payment_link": "https://...cloudpayments..."
}
```

#### `GET /events/my-registrations/`
Получить список всех активных регистраций пользователя.

#### `PATCH /events/update-registration/`
Изменить регистрацию на другое мероприятие.

**Тело запроса:**
```json
{ "event_id": 2 }
```

---




