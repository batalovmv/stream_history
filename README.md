# StreamHub 🎥

Веб-приложение для хранения и публикации планов стримов, а также архива записей.  
Проект создан на **React + TypeScript**, с использованием **Redux Toolkit**, **Mantine UI** и **Supabase** (бэкенд, база данных, аутентификация).

---

## ⚙️ Стек технологий
- **React 18 + Vite + TypeScript** — фронтенд
- **Redux Toolkit** — глобальное состояние (авторизация, пользователь)
- **Mantine UI** — готовые компоненты и стили
- **Supabase** — база данных (PostgreSQL + RLS), аутентификация через Google OAuth
- **GitHub Actions** — CI (lint + тесты + build)
- **Vercel** — деплой и хостинг фронтенда

---

## 📂 Структура проекта (ключевые файлы)

```txt
src/
  AppRouter.tsx              # маршрутизация
  index.tsx                  # входная точка
  theme.ts                   # тема Mantine
  index.css                  # глобальные стили

  store/                     # Redux
    index.ts
    slices/
      authSlice.ts           # состояние пользователя

  lib/
    supabaseClient.ts        # инициализация клиента Supabase

  features/
    auth/
      AuthButton.tsx         # кнопка входа/аватарка
      useAuthSession.ts      # синхронизация сессии с Supabase
    plans/
      components/
        PlansList.tsx        # список планов (редактировать / удалять)
      services/
        plansService.ts      # работа с таблицей plans

  pages/
    HomePage.tsx             # главная
    PlansPage.tsx            # планы стримов (добавление/редактирование)
    ArchivePage.tsx          # архив (пока заглушка)

  components/
    layout/
      Header.tsx             # шапка с навигацией
    ui/
      Container.tsx          # обёртка над Mantine Container

```
---

## 🔑 Аутентификация
- Используется **Supabase Auth** + Google OAuth.  
- После входа:
  - В шапке показывается **аватарка + меню** (с кнопкой «Выйти»).
  - В Redux сохраняется `user`, `isAdmin`.  
- Сессия сохраняется в `localStorage` и доступна на всех вкладках.

---

## 🗄️ База данных (Supabase)
Используется таблица `public.plans`:

```sql
create table if not exists public.plans (
  id bigint primary key generated always as identity,
  title text not null,
  body text,
  scheduled_at timestamptz,
  created_at timestamptz default now(),
  author_id uuid references auth.users (id)
);
RLS-политики:

SELECT — разрешено всем аутентифицированным пользователям (или публично).

INSERT/UPDATE/DELETE — только для администраторов (is_admin = true).

📄 Возможности на текущий момент
🔑 Авторизация через Google (Supabase OAuth)

👤 Меню пользователя с аватаркой и кнопкой «Выйти»

📝 Добавление планов (заголовок, описание, дата)

✏️ Редактирование планов (только админ)

❌ Удаление планов (только админ)

📅 Отображение списка планов (с датой и описанием)

🏠 Главная страница (HomePage)

📚 Заглушка для архива стримов (ArchivePage)

🚀 Деплой
CI/CD через GitHub Actions

Хостинг на Vercel

Переменные окружения:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

▶️ Локальный запуск
bash
Копировать код
# Установить зависимости
npm install

# Запустить дев-сервер
npm run dev

# Сборка
npm run build

# Запуск собранного
npm run preview
✅ Что дальше
Добавить реальный «Архив» (с YouTube-ссылками)

Фильтр по играм

Комментарии под стримами

Страница профиля пользователя