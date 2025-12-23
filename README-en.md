Read this README in Portuguese Brazil:
- [Português (Brasil)](README.md)

# Real-Time Chat App
A real-time chat application developed with a focus on **modern architecture, real-time communication, and data privacy**.  
The project simulates a user queue environment, enabling instant conversations with **automatic translation**, **data expiration**, and **external API request optimization**.

---

## Technologies Used

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Context API**

### Backend / Infrastructure
- **Supabase**
  - Database
  - Realtime (subscriptions)
  - Database cron jobs
- **DeepL API** (automatic message translation)

---

## Project Concept

The application was designed to study **real-time chat systems**, with special attention to:

- Instant communication between users
- Automatic message translation
- Queue-based user management
- Reduction of unnecessary external API calls
- No data persistence (privacy-first, even for a study project)

This is an ephemeral chat: join, talk, leave — nothing lasts forever.

---

## Features

- **User login**
- **Automatic entry into a chat queue**
- **Real-time communication between users**
- **Automatic message translation** using the DeepL API
- **Local translation cache**
  - Prevents multiple DeepL requests for the same content
  - Reduces latency
  - Lowers API usage
- **Chat theme (light/dark)** managed via Context API
- **Automatic data expiration**
  - A Supabase cron job removes:
    - Messages
    - Users
  - After **20 minutes**
- **Automatic logout**
  - After the time limit, the chat session is terminated
  - If the cron job does not remove users in time, a polling mechanism checks whether the user still exists in the database and forces logout if not
  - The user can rejoin the chat if desired

---

## Translation Cache (DeepL)

To optimize performance and reduce API costs:

- A **local translation cache** was implemented
- Previously translated messages do not trigger new API requests
- Ideal for:
  - Fast-paced chats
  - Repeated messages
  - Real-time environments

Result: fewer external calls, faster responses, and a smarter architecture.

---

## Data Policy

To avoid unnecessary data persistence:

- No messages are stored after 20 minutes
- No users remain active after this period
- Cleanup is handled automatically via a **Supabase database cron job**

This approach reinforces best practices around:
- Privacy
- Data lifecycle management
- Ephemeral systems

---

## How to Run the Project

```bash
# Install dependencies
npm install

# Run the frontend
npm run dev

```
## Environment Variables
```
# Create a .env file with:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_DEEPL_API_KEY=

Help tutorial:
https://chatgpt.com/share/6949da6e-2fbc-8003-8f8d-a0b22538688c
```
