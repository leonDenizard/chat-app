Leia este README em inglês:
- [English](README-en.md)

# Real-Time Chat App

Aplicação de chat em tempo real desenvolvida com foco em **arquitetura moderna, comunicação real-time e privacidade de dados**.  
O projeto simula um ambiente de fila de usuários, permitindo conversas instantâneas com **tradução automática**, **expiração de dados** e **otimização de requisições externas**.

---

## Tecnologias Utilizadas

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Context API**

### Backend / Infra
- **Supabase**
  - Database**
  - Realtime (subscriptions)**
  - Cron Jobs no banco**
- **DeepL API** (tradução automática das mensagens)

---

## Conceito do Projeto

A aplicação foi pensada para estudar **sistemas de chat em tempo real**, com atenção especial a:

- Comunicação instantânea entre usuários
- Tradução automática de mensagens
- Gerenciamento de usuários em fila
- Redução de chamadas desnecessárias a APIs externas
- Não persistência de dados (privacy-first, mesmo em projeto de estudo)

Aqui o chat é efêmero: entrou, conversou, acabou — nada fica para sempre.

---

## Funcionalidades

- **Login de usuário**
- **Entrada automática em uma fila de chat**
- **Comunicação em tempo real entre usuários**
- **Tradução automática das mensagens** utilizando a API do DeepL
- **Cache local de traduções**
  - Evita múltiplas requisições para a DeepL com o mesmo conteúdo
  - Reduz latência
  - Diminui consumo da API
- **Tema do chat (light/dark)** gerenciado com Context API
-  **Expiração automática de dados**
  - Cron job no Supabase remove:
    - Mensagens
    - Usuários
  - Após **20 minutos**
- **Logout automático**
  - Após o tempo limite, o chat é encerrado
  - Se o cron job não derrubar os usuários é feito um pooling pra validar se existe usuário no banco e caso não tenha nada é forçado o logout
  - O usuário pode entrar novamente se desejar

---

## Cache de Tradução (DeepL)

Para otimizar performance e reduzir custos de API:

- Foi implementado um **cache local** das traduções
- Mensagens já traduzidas não geram novas requisições
- Ideal para:
  - Chats rápidos
  - Mensagens repetidas
  - Ambientes real-time

Resultado: menos chamadas externas, resposta mais rápida e arquitetura mais inteligente.

---

## Política de Dados

Para evitar persistência desnecessária de informações:

- Nenhuma mensagem é mantida após 20 minutos
- Nenhum usuário permanece ativo após esse período
- O cleanup é feito automaticamente via **cron job no banco do Supabase**

Esse comportamento reforça boas práticas de:
- Privacidade
- Gerenciamento de ciclo de vida de dados
- Sistemas efêmeros

---

## Como Rodar o Projeto

```bash
# Instalar dependências
npm install

# Rodar o frontend
npm run dev
```
## Variáveis de ambiente

```bash
# Crie um arquivo .env com:
npm install

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_DEEPL_API_KEY=

Tutorial de ajuda: https://chatgpt.com/share/6949da6e-2fbc-8003-8f8d-a0b22538688c
```
