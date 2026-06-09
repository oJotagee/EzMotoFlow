# EzMotoFlow — Documentação Técnica do Projeto

---

## 1. Introdução

O mercado de locação e comercialização de motocicletas no Brasil tem crescido de forma expressiva nos últimos anos, impulsionado pelo aumento da demanda por mobilidade urbana de baixo custo e pela popularização das plataformas de entrega por aplicativo. Nesse contexto, estabelecimentos que trabalham com aluguel, venda ou gestão de frotas de motocicletas precisam lidar com um volume considerável de informações: cadastro de clientes, controle de veículos, emissão de contratos e gerenciamento de usuários internos.

O **EzMotoFlow** é um sistema web desenvolvido para atender à essa necessidade, centralizando em uma única plataforma todas as operações essenciais de uma empresa do segmento. O sistema permite o cadastro e gerenciamento de clientes (pessoa física e jurídica), o controle completo do estoque de motocicletas, a emissão e acompanhamento de contratos com suporte a assinatura digital, além de um módulo de gestão de usuários com controle granular de permissões.

A solução foi construída sobre uma arquitetura moderna de aplicação web, com separação entre backend e frontend, utilizando tecnologias amplamente adotadas pelo mercado, o que garante escalabilidade, manutenibilidade e facilidade de integração com outros sistemas.

---

## 2. Objetivos

### 2.1 Objetivo Geral

Desenvolver uma aplicação web completa para gestão de motocicletas, clientes e contratos, capaz de automatizar e digitalizar os processos operacionais de empresas do segmento de locação e comercialização de motocicletas, reduzindo retrabalho, erros manuais e tempo de atendimento.

### 2.2 Objetivos Específicos

- Implementar um módulo de autenticação seguro baseado em tokens JWT, garantindo o controle de acesso à plataforma.
- Desenvolver um sistema de permissões granular por recurso e ação (leitura, criação, atualização, exclusão), permitindo a definição precisa do nível de acesso de cada usuário.
- Criar um módulo de cadastro e gerenciamento de clientes, suportando tanto pessoas físicas quanto jurídicas, com campos de endereço integrados à API de CEP.
- Implementar um módulo de controle de estoque de motocicletas, com armazenamento de fotos via AWS S3, registro de informações técnicas (chassi, RENAVAM, placa) e controle de status (ativo, inativo, em andamento, vendido).
- Desenvolver um módulo de contratos que permita a geração de documentos em PDF e a coleta de assinaturas digitais por link tokenizado.
- Construir uma interface de usuário responsiva, intuitiva e acessível utilizando componentes padronizados.
- Disponibilizar uma API RESTful documentada via Swagger para facilitar futuras integrações.

---

## 3. Revisão Bibliográfica

### 3.1 Aplicações Web Modernas e Arquitetura SPA

O modelo de Single Page Application (SPA) consolidou-se como o paradigma dominante no desenvolvimento de interfaces web modernas. Segundo Flanagan (2020), SPAs proporcionam uma experiência de usuário mais fluida ao eliminar recarregamentos completos de página, delegando ao JavaScript a responsabilidade de renderização e navegação. Essa abordagem exige uma separação clara entre o cliente (frontend) e o servidor (backend), comunicando-se por meio de APIs RESTful ou GraphQL.

### 3.2 Arquitetura REST e APIs

O estilo arquitetural REST (Representational State Transfer), definido por Fielding (2000) em sua dissertação, estabelece um conjunto de restrições para a construção de serviços web interoperáveis. Uma API RESTful organiza os recursos em endpoints identificados por URIs, utiliza os métodos HTTP (GET, POST, PUT, PATCH, DELETE) de forma semântica e é stateless, ou seja, cada requisição contém todas as informações necessárias para ser processada independentemente.

### 3.3 Autenticação com JWT

O JSON Web Token (JWT), padronizado pela RFC 7519, é um mecanismo compacto e autocontido para transmissão segura de informações entre partes como um objeto JSON. Em aplicações web, é amplamente utilizado para autenticação stateless: após o login, o servidor gera um token assinado que é enviado ao cliente e anexado a cada requisição subsequente, dispensando o uso de sessões no servidor (Jones et al., 2015).

### 3.4 ORM e Mapeamento Objeto-Relacional

O uso de ORMs (Object-Relational Mappers) abstrai a complexidade do SQL, permitindo que o desenvolvedor interaja com o banco de dados por meio de objetos e classes na linguagem de programação utilizada. Prisma, em particular, introduz o conceito de "schema-first", onde o modelo de dados é declarado em um arquivo de schema e o cliente tipado é gerado automaticamente, reduzindo erros em tempo de compilação (Prisma Docs, 2024).

### 3.5 Armazenamento em Nuvem

O armazenamento de arquivos estáticos (imagens, PDFs) em serviços de nuvem como o Amazon S3 é uma prática recomendada para aplicações web escaláveis. O S3 oferece alta durabilidade (99,999999999%), disponibilidade e integração nativa com outros serviços AWS, além de suporte a políticas de acesso granulares (AWS Documentation, 2024).

### 3.6 Assinatura Digital

A assinatura digital é um mecanismo criptográfico que permite verificar a autoria e a integridade de um documento eletrônico. No contexto de contratos, a utilização de tokens de assinatura com prazo de validade garante que apenas o destinatário autorizado possa assinar o documento, conferindo validade jurídica ao processo, conforme previsto pela Medida Provisória nº 2.200-2/2001 e suas atualizações no ordenamento jurídico brasileiro.

---

## 4. Materiais e Métodos

### 4.1 Linguagens de Programação

#### 4.1.1 TypeScript

TypeScript é um superconjunto tipado de JavaScript desenvolvido pela Microsoft e lançado em 2012. Ele adiciona ao JavaScript um sistema de tipos estáticos opcionais, interfaces, enums, genéricos e outras construções de linguagem que aumentam a previsibilidade e a segurança do código, especialmente em projetos de médio e grande porte.

O TypeScript é compilado (transpilado) para JavaScript puro antes da execução, sendo compatível com qualquer ambiente que execute JavaScript — navegadores, Node.js ou Deno. No EzMotoFlow, TypeScript foi adotado tanto no backend quanto no frontend, garantindo consistência e permitindo o compartilhamento implícito de contratos de dados entre as camadas.

**Como funciona:** O desenvolvedor escreve código `.ts`, declara tipos para variáveis, parâmetros e retornos de funções. O compilador `tsc` valida o código em tempo de build, apontando inconsistências de tipos antes mesmo da execução. No ambiente de desenvolvimento, ferramentas como o VS Code fornecem autocompletar e detecção de erros em tempo real.

#### 4.1.2 SQL (via Prisma/PostgreSQL)

SQL (Structured Query Language) é a linguagem padrão para comunicação com bancos de dados relacionais. No projeto, SQL não é escrito diretamente pelo desenvolvedor — as queries são geradas pelo Prisma ORM com base nas operações realizadas nos modelos. Ainda assim, o SQL é executado no banco PostgreSQL como linguagem de consulta subjacente, incluindo operações de `SELECT`, `INSERT`, `UPDATE`, `DELETE` e `JOIN`.

---

### 4.2 Arquitetura do Sistema

O EzMotoFlow adota uma **arquitetura cliente-servidor com separação de camadas (Layered Architecture)**, organizada em dois projetos distintos que se comunicam via HTTP:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                    │
│              React SPA — Vite — TailwindCSS                 │
│         React Query · Axios · Zustand · React Hook Form     │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTP / REST (JSON)
┌──────────────────────────▼──────────────────────────────────┐
│                      BACKEND (Node.js)                      │
│                NestJS — TypeScript — Swagger                │
│   Controllers → Services → Repositories (via Prisma ORM)   │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼───────────────────┐
          │                │                   │
┌─────────▼──────┐  ┌──────▼──────┐  ┌────────▼────────┐
│  PostgreSQL DB │  │   AWS S3    │  │  SMTP (Mail)    │
│  (Prisma ORM)  │  │  (Arquivos) │  │  (Nodemailer)   │
└────────────────┘  └─────────────┘  └─────────────────┘
```

No backend, a arquitetura segue o padrão **Modular MVC** promovido pelo NestJS:

- **Controllers**: recebem as requisições HTTP, validam os dados de entrada (DTOs) e delegam ao serviço correspondente.
- **Services**: contêm a lógica de negócio, orquestram chamadas ao banco de dados e a serviços externos.
- **Modules**: encapsulam um conjunto coeso de controllers, services e providers, seguindo o princípio de responsabilidade única.

Os módulos implementados são: `AuthModule`, `UsersModule`, `MotorcycleModule`, `ClientsModule`, `ContractModule`, `AwsS3Module` e `MailModule`.

---

### 4.3 Frameworks e Bibliotecas

#### 4.3.1 Backend — NestJS

**NestJS** é um framework Node.js para construção de aplicações server-side eficientes e escaláveis, fortemente inspirado na arquitetura do Angular. Lançado em 2017 por Kamil Mysliwiec, utiliza TypeScript nativamente e é construído sobre o Express (por padrão) ou Fastify.

**Como funciona:** O NestJS organiza a aplicação em módulos, controllers e providers (services). Utiliza decoradores TypeScript (`@Controller`, `@Get`, `@Post`, `@Injectable`, etc.) para declarar metadados que o sistema de injeção de dependências utiliza para montar o grafo de dependências automaticamente. Isso facilita a testabilidade e a manutenção do código.

O framework também oferece:
- **Guards**: para proteção de rotas (autenticação/autorização via `JwtAuthGuard` e `PermissionsGuard`).
- **Pipes**: para validação e transformação de dados de entrada (`ValidationPipe` com `class-validator`).
- **Filters**: para tratamento centralizado de exceções (`ApiExceptionFilter`).
- **Interceptors**: para transformação de respostas.

**Versão utilizada:** NestJS 11.x

#### 4.3.2 Frontend — React

**React** é uma biblioteca JavaScript de código aberto mantida pelo Meta (Facebook) para a construção de interfaces de usuário baseadas em componentes. Lançada em 2013, tornou-se a biblioteca frontend mais utilizada no mundo.

**Como funciona:** React adota o paradigma de programação declarativa — o desenvolvedor descreve como a interface deve ser em função do estado atual (dados), e o React se encarrega de atualizar eficientemente o DOM real por meio de um DOM virtual (Virtual DOM). Com os React Hooks (`useState`, `useEffect`, `useContext`, etc.), o gerenciamento de estado e ciclo de vida é possível em componentes funcionais, sem necessidade de classes.

No EzMotoFlow, React é utilizado com:
- **React Router DOM v6**: gerenciamento de rotas no lado cliente (SPA routing).
- **React Hook Form**: gerenciamento de formulários performático, com integração ao Zod para validação de schemas.
- **TanStack React Query**: gerenciamento de estado assíncrono (fetching, caching e sincronização de dados do servidor).
- **Zustand**: gerenciamento de estado global leve e sem boilerplate.

**Versão utilizada:** React 18.x

#### 4.3.3 Frontend — Vite

**Vite** é uma ferramenta de build moderna para projetos frontend, criada por Evan You (criador do Vue.js) em 2020. Diferencia-se do webpack por utilizar ES Modules nativos do navegador durante o desenvolvimento, o que resulta em tempos de inicialização extremamente rápidos e hot module replacement (HMR) quase instantâneo.

**Como funciona:** Em desenvolvimento, o Vite serve os arquivos diretamente sem bundling, apenas transformando-os on-demand com esbuild. Em produção, utiliza Rollup para gerar bundles otimizados com code splitting e tree shaking.

**Versão utilizada:** Vite 5.x

#### 4.3.4 Frontend — TailwindCSS e shadcn/ui

**TailwindCSS** é um framework CSS utilitário que fornece classes de baixo nível (como `flex`, `p-4`, `text-lg`, `bg-blue-500`) para estilização direta no HTML/JSX, eliminando a necessidade de escrever CSS personalizado na maioria dos casos.

**shadcn/ui** é uma coleção de componentes React acessíveis, construídos sobre **Radix UI** (primitivos headless) e estilizados com TailwindCSS. Diferentemente de bibliotecas de componentes tradicionais, o shadcn/ui não é instalado como pacote npm — os componentes são copiados diretamente para o projeto, permitindo total customização.

#### 4.3.5 Validação — Zod e class-validator

- **Zod** (frontend): biblioteca de validação de schemas TypeScript-first, utilizada em conjunto com o React Hook Form para validar formulários com tipagem segura.
- **class-validator** (backend): biblioteca de validação declarativa via decoradores, utilizada nos DTOs do NestJS para validar o corpo das requisições HTTP.

#### 4.3.6 Geração de PDF — pdf-lib e jsPDF

- **pdf-lib** (backend): utilizada para manipulação e preenchimento programático de documentos PDF no servidor, como a geração de contratos.
- **jsPDF** (frontend): utilizada para geração de PDFs diretamente no navegador quando necessário.

---

### 4.4 Banco de Dados

#### 4.4.1 PostgreSQL

**PostgreSQL** é um sistema gerenciador de banco de dados objeto-relacional de código aberto, com mais de 35 anos de desenvolvimento ativo. É considerado um dos bancos de dados mais robustos e ricos em funcionalidades do mercado, suportando transações ACID, chaves estrangeiras, triggers, views, stored procedures e tipos de dados avançados como JSON/JSONB.

**Como funciona:** O PostgreSQL opera em modelo cliente-servidor. O servidor gerencia os arquivos do banco, aceita conexões de clientes e executa as queries SQL. Cada instância pode conter múltiplos bancos de dados, schemas e tabelas. O sistema utiliza MVCC (Multi-Version Concurrency Control) para gerenciar concorrência sem bloqueios excessivos.

No EzMotoFlow, o PostgreSQL armazena todas as entidades transacionais do sistema. O campo `signatures` do modelo `Contracts` é armazenado como `Json` nativo do PostgreSQL, aproveitando a flexibilidade do tipo JSONB para dados semi-estruturados.

#### 4.4.2 Prisma ORM

**Prisma** é um ORM (Object-Relational Mapper) de nova geração para Node.js e TypeScript, composto por três ferramentas principais:

1. **Prisma Schema**: arquivo de definição do modelo de dados (`schema.prisma`), que descreve as entidades, seus campos, tipos, relações e constraints.
2. **Prisma Migrate**: ferramenta de migração que gera e aplica arquivos SQL versionados com base nas alterações do schema.
3. **Prisma Client**: cliente de banco de dados gerado automaticamente e totalmente tipado com base no schema, eliminando erros de digitação em queries.

**Como funciona:** O desenvolvedor define os modelos no `schema.prisma`. Ao executar `prisma migrate dev`, o Prisma compara o schema atual com o estado do banco e gera as migrações SQL necessárias. O `prisma generate` cria o `PrismaClient` tipado, que oferece autocompletar para todas as operações de banco de dados.

**Modelos definidos no schema:**

| Modelo | Descrição |
|---|---|
| `Users` | Usuários internos do sistema com hash de senha |
| `UserPermission` | Permissões por recurso (USERS, CLIENTS, MOTORCYCLES, CONTRACTS) e ação (READ, CREATE, UPDATE, DELETE) |
| `MotorCycle` | Cadastro de motocicletas com dados técnicos e fotos |
| `Clients` | Clientes PF (CPF) e PJ (CNPJ) com endereço completo |
| `Contracts` | Contratos vinculando cliente e moto, com PDF, assinatura digital e token |

---

### 4.5 Serviços Externos

#### 4.5.1 Amazon S3

O **Amazon Simple Storage Service (S3)** é utilizado para armazenamento das fotos das motocicletas (até 3 fotos por veículo) e dos arquivos PDF dos contratos. A integração é feita com o AWS SDK v3 para Node.js (`@aws-sdk/client-s3`), encapsulada no `AwsS3Module` e `AwsS3Service`.

#### 4.5.2 Nodemailer

**Nodemailer** é uma biblioteca Node.js para envio de e-mails via SMTP. No EzMotoFlow, é utilizada pelo `MailModule` para disparar notificações, como o envio do link de assinatura digital do contrato ao cliente.

#### 4.5.3 API de CEP (ViaCEP)

A busca automática de endereço pelo CEP é realizada no frontend por meio da API pública **ViaCEP**, consultada via Axios. Ao informar o CEP no cadastro de cliente, os campos de rua, bairro, cidade e estado são preenchidos automaticamente, reduzindo erros de digitação.

---

### 4.6 Segurança

- **Hashing de senhas**: as senhas dos usuários são armazenadas com hash gerado pelo `bcryptjs` (custo adaptativo), nunca em texto plano.
- **Autenticação JWT**: o módulo de autenticação gera tokens assinados com `@nestjs/jwt`. Rotas protegidas exigem o token no cabeçalho `Authorization: Bearer <token>`.
- **Controle de permissões**: cada rota protegida pode exigir uma combinação de recurso + ação (e.g., `MOTORCYCLES:CREATE`). O `PermissionsGuard` verifica se o usuário autenticado possui a permissão necessária antes de processar a requisição.
- **Validação de entrada**: todos os DTOs do backend utilizam `class-validator` para rejeitar dados malformados antes que cheguem à camada de serviço.
- **Tokens de assinatura**: o link de assinatura de contratos utiliza um `signatureToken` com `signatureTokenExpiry`, garantindo que o link expire após um período determinado.

---

## 5. Resultados e Discussão

### 5.1 Sistema Implementado

O desenvolvimento do EzMotoFlow resultou em uma aplicação web fullstack funcional com os seguintes módulos operacionais:

**Módulo de Autenticação e Usuários**
O sistema conta com login via e-mail e senha, geração de token JWT e controle de sessão no frontend via cookies seguros (biblioteca `js-cookie`). O módulo de usuários permite o cadastro de operadores com permissões individualizadas por recurso e ação, tornando o sistema adequado para empresas com múltiplos colaboradores em funções distintas.

**Módulo de Motocicletas**
Permite o cadastro completo de veículos com informações técnicas (placa, chassi, RENAVAM, ano, cor, quilometragem), valores (compra, venda e FIPE) e até três fotos por veículo, armazenadas no Amazon S3. O controle de status (`ativo`, `inativo`, `em andamento`, `vendido`) permite rastrear o ciclo de vida de cada motocicleta na frota.

**Módulo de Clientes**
Suporta o cadastro de clientes pessoa física (CPF) e pessoa jurídica (CNPJ), com campos de contato e endereço completo. A busca automática de endereço por CEP agiliza o processo de cadastro e reduz erros.

**Módulo de Contratos**
É o módulo central do sistema. Vincula um cliente a uma motocicleta, registra o valor, a forma de pagamento (`boleto`, `cartão`, `pix`) e o status do contrato (`ativo`, `cancelado`, `finalizado`). Gera o PDF do contrato e permite o envio de um link de assinatura digital ao cliente, com token de validade controlada.

**Dashboard**
A tela inicial do sistema exibe indicadores consolidados sobre o estado da operação, permitindo uma visão rápida do desempenho do negócio.

### 5.2 Discussão

A escolha do NestJS para o backend mostrou-se acertada para um projeto dessa natureza. A estrutura modular imposta pelo framework disciplina a organização do código desde o início, facilitando a manutenção e a adição de novas funcionalidades. O uso de guards e pipes centralizados eliminou código repetitivo de validação e autenticação nos controllers.

O Prisma, por sua vez, acelerou significativamente o desenvolvimento da camada de dados. A geração automática do cliente tipado reduziu a ocorrência de erros relacionados a nomes de campos ou tipos incompatíveis, e o sistema de migrações garantiu rastreabilidade das evoluções do schema.

No frontend, a combinação de React Query com Axios provou ser eficiente para gerenciar o ciclo de vida das requisições assíncronas, incluindo cache automático, refetch e estados de loading/error sem boilerplate excessivo. O uso do shadcn/ui acelerou o desenvolvimento de componentes de interface mantendo consistência visual e acessibilidade.

Um ponto de atenção identificado é a dependência de serviços externos (AWS S3 e SMTP) que precisam ser configurados adequadamente no ambiente de produção. A modularização desses serviços no NestJS facilita a substituição futura por alternativas (e.g., trocar o S3 por outro provedor de storage) sem impactar os demais módulos.

---

## 6. Conclusão

O EzMotoFlow demonstrou ser uma solução viável e tecnicamente sólida para a digitalização da gestão de motocicletas, clientes e contratos. A utilização de um stack moderno e bem estabelecido — NestJS, React, PostgreSQL, Prisma e AWS S3 — garantiu ao sistema uma base confiável, com boa capacidade de evolução e manutenção.

A arquitetura cliente-servidor com API RESTful proporcionou desacoplamento entre as camadas, permitindo que frontend e backend evoluam de forma independente. O sistema de permissões granular atende às necessidades de empresas com equipes diversas, e o módulo de contratos com assinatura digital representa um diferencial importante frente a processos manuais baseados em papel.

Como trabalhos futuros, sugere-se:

- **Relatórios e exportação de dados**: geração de relatórios financeiros e operacionais em PDF ou Excel.
- **Notificações em tempo real**: implementação de WebSockets (via `@nestjs/websockets`) para alertas instantâneos de novos contratos ou vencimentos.
- **Aplicativo móvel**: desenvolvimento de um cliente mobile (React Native) consumindo a mesma API REST.
- **Integração com sistemas de pagamento**: integração com gateways como Stripe ou Asaas para cobrança automatizada de contratos.
- **Testes automatizados**: expansão da cobertura de testes unitários e de integração, com implementação de testes end-to-end com Playwright ou Cypress.

---

## Referências

- FIELDING, Roy Thomas. **Architectural Styles and the Design of Network-based Software Architectures**. Dissertação de Doutorado — University of California, Irvine, 2000.
- FLANAGAN, David. **JavaScript: The Definitive Guide**. 7. ed. O'Reilly Media, 2020.
- JONES, M.; BRADLEY, J.; SAKIMURA, N. **RFC 7519 — JSON Web Token (JWT)**. IETF, 2015. Disponível em: https://www.rfc-editor.org/rfc/rfc7519
- NESTJS DOCUMENTATION. **NestJS — A progressive Node.js framework**. Disponível em: https://docs.nestjs.com. Acesso em: maio 2026.
- PRISMA DOCUMENTATION. **Prisma ORM — Next-generation Node.js and TypeScript ORM**. Disponível em: https://www.prisma.io/docs. Acesso em: maio 2026.
- REACT DOCUMENTATION. **React — The library for web and native user interfaces**. Disponível em: https://react.dev. Acesso em: maio 2026.
- AMAZON WEB SERVICES. **Amazon S3 Documentation**. Disponível em: https://docs.aws.amazon.com/s3. Acesso em: maio 2026.
- MICROSOFT. **TypeScript Documentation**. Disponível em: https://www.typescriptlang.org/docs. Acesso em: maio 2026.
- BRASIL. **Medida Provisória nº 2.200-2**, de 24 de agosto de 2001. Institui a Infraestrutura de Chaves Públicas Brasileira — ICP-Brasil. Brasília, DF, 2001.
