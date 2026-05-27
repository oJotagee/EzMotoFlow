# EzMotoFlow

Sistema de gestão para revendas de motos — controle de estoque, clientes, contratos digitais e assinaturas eletrônicas.

---

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USUÁRIO / BROWSER                          │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    FRONTEND  (React + Vite)                          │
│                    client/  — porta 8080                             │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │  Auth    │  │  Moto-   │  │  Clientes   │  │   Contratos     │    │
│  │  Login   │  │  ciclos  │  │  CRUD       │  │   + Assinatura  │    │
│  └──────────┘  └──────────┘  └─────────────┘  └─────────────────┘    │
│                                                                      │
│  Estado Global: Zustand (auth, permissões, tema, sidebar)            │
│  Cache de Servidor: TanStack React Query                             │
│  Formulários: React Hook Form + Zod                                  │
│  UI: shadcn/ui + Radix UI + TailwindCSS                              │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ REST (Axios + Bearer JWT)
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    BACKEND  (NestJS)                                 │
│                    api/  — porta 3000                                │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                      Guards / Interceptors                     │  │
│  │          AuthTokenGuard (JWT)   PermissionsGuard (RBAC)        │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────┐     │
│  │  Auth    │ │  Users   │ │  Clients  │ │  Moto-   │ │  Con-  │     │
│  │  Module  │ │  Module  │ │  Module   │ │  cycle   │ │  tract │     │
│  │          │ │          │ │           │ │  Module  │ │  Module│     │
│  └──────────┘ └──────────┘ └───────────┘ └──────────┘ └────────┘     │
│                                                                      │
│  ┌──────────────────────┐   ┌───────────────────────────────────┐    │
│  │     AwsS3Module      │   │           MailModule              │    │
│  │  Upload fotos + PDFs │   │   SMTP Gmail — links de assinatura│    │
│  └──────────────────────┘   └───────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │                  PrismaService (ORM)                        │     │
│  │              @prisma/adapter-pg (pool de conexões)          │     │
│  └──────────────────────────────┬──────────────────────────────┘     │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │ PostgreSQL (SSL)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   BANCO DE DADOS — Neon Cloud                       │
│                   PostgreSQL  (sa-east-1 / AWS)                     │
│                                                                     │
│   users ──────── user_permission                                    │
│                                                                     │
│   clients ─────────────────────────┐                                │
│                                    ▼                                │
│   motor_cycle ─────────────── contracts                             │
└─────────────────────────────────────────────────────────────────────┘

Serviços Externos:
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  AWS S3      │  │  Gmail SMTP  │  │  Clicksign   │
  │  Fotos +     │  │  E-mails de  │  │  Assinatura  │
  │  PDFs        │  │  assinatura  │  │  digital     │
  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Schema do Banco de Dados

```
┌──────────────────────┐         ┌──────────────────────────────┐
│        users         │         │       user_permission        │
├──────────────────────┤         ├──────────────────────────────┤
│ id (uuid) PK         │─────────│ id (uuid) PK                 │
│ name                 │  1  n   │ userId (uuid) FK             │
│ email (unique)       │         │ resource (enum)              │
│ password (bcrypt)    │         │   USERS | CLIENTS            │
│ created_at           │         │   MOTORCYCLES | CONTRACTS    │
│ updated_at           │         │ action (enum)                │
└──────────────────────┘         │   READ | CREATE              │
                                 │   UPDATE | DELETE            │
                                 └──────────────────────────────┘

┌──────────────────────┐
│       clients        │
├──────────────────────┤
│ id (uuid) PK         │
│ tipo (enum)          │          ┌──────────────────────────────┐
│   PESSOA_FISICA      │          │         contracts            │
│   PESSOA_JURIDICA    │          ├──────────────────────────────┤
│ fullName             │────┐     │ id (uuid) PK                 │
│ documento (unique)   │    │     │ clienteId (uuid) FK          │
│ telefone             │    └───▶│ motoCycleId (uuid) FK        │
│ email (unique)       │    ┌───▶│ valor (decimal)              │
│ dataNascimento       │    │     │ data                         │
│ companyName          │    │     │ pagamento (enum)             │
│ cep / rua / numero   │    │     │   BOLETO | CARTAO | PIX      │
│ bairro / cidade      │    │     │ status (enum)                │
│ estado / complemento │    │     │   ativo | cancelado          │
│ status               │    │     │   finalizado                 │
│ created_at           │    │     │ contractoPdf (S3 URL)        │
│ updated_at           │    │     │ signatures (JSON)            │
└──────────────────────┘    │     │ signatureToken               │
                            │     │ signatureTokenExpiry         │
┌──────────────────────┐    │     │ observacao                   │
│      motor_cycle     │    │     │ created_at                   │
├──────────────────────┤    │     │ updated_at                   │
│ id (uuid) PK         │────┘     └──────────────────────────────┘
│ nome                 │
│ cor                  │
│ placa (unique)       │
│ ano                  │
│ chassi (unique)      │
│ renavam (unique)     │
│ km                   │
│ valor_compra         │
│ valor_venda          │
│ valor_fipe           │
│ foto1/2/3 (S3 URLs)  │
│ status (enum)        │
│   ativo | inativo    │
│   vendido | andamento│
│ observacao           │
│ created_at           │
│ updated_at           │
└──────────────────────┘
```

---

## Stack de Tecnologias

### Backend — `api/`

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework | NestJS | 11.0 |
| Linguagem | TypeScript | 5.x |
| ORM | Prisma | 7.0 |
| Banco | PostgreSQL (Neon Cloud) | — |
| Autenticação | JWT (`@nestjs/jwt`) | 11.0 |
| Hash de senha | bcryptjs | 3.0 |
| Armazenamento | AWS S3 (`@aws-sdk/client-s3`) | 3.x |
| PDF | pdf-lib | 1.17 |
| E-mail | Nodemailer | 7.0 |
| Documentação | Swagger / OpenAPI | 11.0 |
| Validação | class-validator + class-transformer | 0.14 |
| HTTP Client | Axios + @nestjs/axios | 1.x |
| Testes | Jest + ts-jest | 29.x |
| Lint/Format | ESLint + Prettier + Biome | — |

### Frontend — `client/`

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework | React | 18.3 |
| Linguagem | TypeScript | 5.8 |
| Build | Vite + SWC | 5.4 |
| Estilização | TailwindCSS | 3.4 |
| Componentes UI | shadcn/ui + Radix UI | — |
| Ícones | Lucide React + React Icons | — |
| Roteamento | React Router DOM | 6.x |
| Estado global | Zustand | 5.0 |
| Cache servidor | TanStack React Query | 5.x |
| Formulários | React Hook Form | 7.x |
| Validação | Zod | 4.x |
| HTTP | Axios | 1.x |
| Animações | Framer Motion | 12.x |
| Gráficos | Recharts | 2.x |
| Notificações | Sonner | 1.x |
| PDF (client) | jsPDF + html2canvas | 3.x |
| Assinatura | react-signature-canvas | 1.x |
| Datas | date-fns + Moment.js | — |

---

## Estrutura de Diretórios

```
EzMotoFlow/
├── api/                          # Backend NestJS
│   ├── src/
│   │   ├── app/                  # Módulo raiz
│   │   ├── auth/                 # Autenticação + guards + JWT
│   │   │   ├── guard/            # AuthTokenGuard, PermissionsGuard
│   │   │   ├── dto/              # LoginDto, PayloadDto
│   │   │   └── hash/             # bcrypt service
│   │   ├── users/                # Gestão de usuários
│   │   ├── clients/              # Gestão de clientes
│   │   ├── motorcycle/           # Estoque de motos
│   │   ├── contract/             # Contratos + assinatura digital
│   │   ├── aws/                  # Upload S3 (fotos + PDFs)
│   │   ├── mail/                 # Envio de e-mails SMTP
│   │   ├── prisma/               # PrismaService
│   │   └── commom/               # Filtros, interceptors, DTOs globais
│   ├── prisma/
│   │   ├── schema.prisma         # Schema do banco
│   │   ├── migrations/           # Histórico de migrações
│   │   └── seed.ts               # Dados iniciais
│   └── tsconfig.json
│
├── client/                       # Frontend React
│   ├── src/
│   │   ├── App.tsx               # Definição de rotas
│   │   ├── components/
│   │   │   ├── ui/               # shadcn/ui (button, input, dialog…)
│   │   │   ├── layout/           # Layout, Sidebar, ProtectedRoute
│   │   │   └── auth/
│   │   ├── pages/
│   │   │   ├── auth/             # Login
│   │   │   ├── dashboard/        # Dashboard
│   │   │   ├── users/            # CRUD de usuários
│   │   │   ├── clients/          # CRUD de clientes
│   │   │   ├── motorcycles/      # CRUD de motos
│   │   │   ├── contracts/        # CRUD de contratos
│   │   │   └── signature/        # Página pública de assinatura
│   │   ├── stores/               # Zustand (auth, permissions, sidebar, theme)
│   │   ├── services/             # Chamadas à API
│   │   ├── lib/                  # api.ts (axios), utils, cep lookup
│   │   ├── hooks/                # Custom hooks
│   │   └── types/                # Tipos TypeScript
│   └── vite.config.ts
│
├── biome.json                    # Linter/formatter global
└── package.json                  # Workspace root
```

---

## Fluxo de Autenticação e Permissões

```
Login (POST /auth)
      │
      ▼
 bcrypt.compare()
      │
      ▼
 JWT gerado (TTL: 7d)
      │
      ▼
 Cookie "user-auth" no browser
      │
      ▼
 Zustand auth store ──► permissions store (RBAC por recurso + ação)
      │
      ▼
 Toda request ──► AuthTokenGuard ──► PermissionsGuard
                    (valida JWT)       (valida recurso+ação)
```

**Recursos (resource):** `USERS` | `CLIENTS` | `MOTORCYCLES` | `CONTRACTS`  
**Ações (action):** `READ` | `CREATE` | `UPDATE` | `DELETE`

---

## Fluxo de Contrato e Assinatura Digital

```
1. Criar contrato (POST /contract)
         │
         ▼
   PDF gerado com pdf-lib
         │
         ▼
   PDF enviado para AWS S3
         │
         ▼
   signatureToken gerado (válido por 48 horas)
         │
         ▼
   E-mail enviado via Gmail SMTP
   com link: /signature/:token
         │
         ▼
   Cliente acessa link público
   assina digitalmente na tela
         │
         ▼
   Assinatura salva em contracts.signatures (JSON)
   PDF atualizado no S3
```

---

## Endpoints da API

```
Auth:
  POST   /auth                     Login → retorna JWT

Usuários:
  GET    /users                    Listar (paginado, filtro por nome)
  POST   /users                    Criar
  PATCH  /users/:id                Atualizar
  DELETE /users/:id                Deletar

Clientes:
  GET    /clients                  Listar (paginado, filtro nome/documento)
  POST   /clients                  Criar
  PATCH  /clients/:id              Atualizar
  DELETE /clients/:id              Deletar

Motos:
  GET    /motorcycle               Listar (filtro placa, nome, ano, status)
  POST   /motorcycle               Criar (com upload de fotos para S3)
  PATCH  /motorcycle/:id           Atualizar
  DELETE /motorcycle/:id           Deletar

Contratos:
  GET    /contract                 Listar
  POST   /contract                 Criar (gera PDF + envia e-mail)
  DELETE /contract/:id             Deletar

Documentação:
  GET    /docs                     Swagger UI (OpenAPI)
```

---

## Variáveis de Ambiente

### API (`api/.env`)

```env
# Banco de dados
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=
JWT_TOKEN_AUDIENCE=
JWT_TOKEN_ISSUER=
JWT_TTL=7d

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-2
AWS_S3_BUCKET=ezmotoflow

# E-mail (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Assinatura digital
CLICKSIGN_API_KEY=

# URL do frontend (geração de links de assinatura)
FRONTEND_URL=http://localhost:8080
```

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- npm 10+
- PostgreSQL (ou conta Neon Cloud)

### Backend

```bash
cd api
npm install
cp .env.example .env   # configure as variáveis
npx prisma migrate dev
npx prisma db seed
npm run start:dev       # http://localhost:3000
```

Swagger disponível em: `http://localhost:3000/docs`

### Frontend

```bash
cd client
npm install
npm run dev             # http://localhost:8080
```

---

## Scripts Disponíveis

### API

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Servidor com hot-reload |
| `npm run start:prod` | Servidor de produção |
| `npm run build` | Compilar TypeScript |
| `npm test` | Rodar testes unitários |
| `npm run test:e2e` | Testes end-to-end |

### Client

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |

---

## Deploy

| Serviço | Plataforma |
|---------|-----------|
| API | Render (`https://ezmotoflow.onrender.com`) |
| Banco | Neon Cloud (PostgreSQL serverless) |
| Arquivos | AWS S3 (bucket `ezmotoflow`, região `us-east-2`) |
| E-mail | Gmail SMTP |

---

## Links

- **API (Produção):** [https://ezmotoflow.onrender.com](https://ezmotoflow.onrender.com)
- **Documentação Swagger:** [https://ezmotoflow.onrender.com/docs](https://ezmotoflow.onrender.com/docs)
