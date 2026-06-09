# EzMotoFlow — Documentação Técnica do Projeto

---

## 1. INTRODUÇÃO

A ideia do projeto surgiu da observação de que lojas de motocicletas de pequeno e médio porte ainda enfrentam dificuldades para organizar suas operações diárias de forma digital. O processo de criação de contratos, controle do estoque de veículos e gerenciamento de clientes é, em muitos casos, realizado de maneira manual, com registros em papel, planilhas isoladas e informações dispersas em diferentes ferramentas.

Esse cenário resulta em retrabalho, inconsistência de dados, dificuldade no acompanhamento dos contratos e maior exposição a erros que podem impactar diretamente a qualidade do atendimento e a saúde financeira do negócio. A ausência de um sistema integrado força os lojistas a dedicarem tempo excessivo a tarefas administrativas em detrimento das atividades estratégicas do negócio.

O **EzMotoFlow** é um sistema web desenvolvido para centralizar essas operações em uma única plataforma. Ele permite o cadastro e gerenciamento de clientes (pessoa física e jurídica), o controle completo do estoque de motocicletas, a emissão e acompanhamento de contratos com suporte a assinatura digital, além de um módulo de gestão de usuários com controle granular de permissões por recurso e ação.

A solução foi construída sobre uma arquitetura moderna de aplicação web, com separação entre servidor (backend) e cliente (frontend), utilizando tecnologias amplamente adotadas pelo mercado, garantindo escalabilidade, manutenibilidade e facilidade de integração com outros sistemas.

---

## 2. JUSTIFICATIVA

Este projeto justifica-se tanto pela sua relevância social quanto pela sua contribuição técnica. Do ponto de vista social, oferece uma solução concreta para lojas de motos que ainda lidam com contratos e controle de estoque de forma manual, o que pode gerar desorganização, perda de tempo e erros operacionais. Com um sistema que centraliza a criação de contratos, a gestão de veículos e o controle de clientes, o dia a dia dessas lojas torna-se mais ágil, profissional e eficiente.

Do ponto de vista técnico, o projeto se destaca por integrar múltiplas funcionalidades em uma única plataforma — algo ainda pouco explorado com foco específico no segmento de motocicletas. Ao unir gestão de contratos com assinatura digital, controle de estoque e administração de usuários com permissões granulares, o EzMotoFlow preenche uma lacuna nos sistemas de gestão disponíveis para esse nicho. O trabalho tem relevância tanto pela inovação proposta quanto pelo impacto direto na rotina dos comerciantes do segmento.

---

## 3. OBJETIVOS

### 3.1. OBJETIVO GERAL

Desenvolver e implementar o EzMotoFlow, um sistema web de gestão para lojas de motocicletas de pequeno e médio porte, que centralize o cadastro de veículos, o gerenciamento de clientes e a emissão de contratos, promovendo maior eficiência, organização e segurança nas operações diárias do negócio.

### 3.2. OBJETIVOS ESPECÍFICOS

- **Centralizar informações:** Consolidar em um único ambiente os dados de motocicletas, clientes e contratos, facilitando o acesso por usuários com diferentes níveis de permissão.
- **Automatizar fluxos de trabalho:** Reduzir tarefas manuais e repetitivas, como o preenchimento de endereço por CEP e a geração de PDF de contratos, aumentando a eficiência operacional.
- **Desenvolver uma interface intuitiva:** Criar interfaces responsivas e acessíveis que possam ser utilizadas por qualquer pessoa, independentemente do nível de familiaridade com tecnologia.
- **Garantir segurança e controle de acesso:** Implementar autenticação baseada em tokens JWT e um sistema de permissões por recurso e ação, assegurando que cada usuário acesse apenas as funcionalidades que lhe são permitidas.
- **Habilitar assinatura digital de contratos:** Desenvolver um fluxo de assinatura por link tokenizado com prazo de validade, permitindo que o cliente assine o contrato remotamente de forma segura e rastreável.
- **Documentar a API:** Disponibilizar uma API RESTful documentada, facilitando futuras integrações e a compreensão das rotas por novos desenvolvedores.
- **Testar e validar:** Verificar o funcionamento do sistema em situações reais ou simuladas, coletando subsídios para ajustes e melhorias contínuas.
- **Explorar evoluções futuras:** Avaliar a viabilidade de integrações com sistemas financeiros, plataformas de anúncios e outras ferramentas de apoio à gestão do negócio.

---

## 4. PROBLEMATIZAÇÃO

Apesar do avanço da tecnologia, muitas lojas de motocicletas ainda enfrentam dificuldades para organizar contratos de compra, venda e locação, controlar o estoque de motos e gerenciar seus clientes de forma eficiente. A gestão manual dessas atividades pode causar erros, atrasos e perda de oportunidades de negócio. Diante dessa realidade, levanta-se a seguinte questão:

*Como um sistema web pode facilitar a criação de contratos, o controle do estoque de motocicletas e a gestão de clientes em lojas de pequeno e médio porte?*

---

## 5. HIPÓTESE

A implementação de um sistema web que automatize a criação de contratos, o controle do estoque de veículos e o gerenciamento de clientes pode aumentar a eficiência operacional das lojas de motocicletas, reduzir erros na gestão e proporcionar maior rastreabilidade das operações realizadas.

---

## 6. REVISÃO BIBLIOGRÁFICA

A revisão bibliográfica foi conduzida com foco nos objetivos do projeto: digitalizar e otimizar a gestão operacional de lojas do segmento de motocicletas por meio de um sistema web moderno. A pesquisa abrangeu conceitos e tecnologias que fundamentam a solução desenvolvida, como arquitetura de aplicações web, frameworks JavaScript, bancos de dados relacionais e serviços de armazenamento em nuvem.

### 6.1. PESQUISA BIBLIOGRÁFICA DO PROBLEMA EM QUESTÃO

A digitalização de processos operacionais é uma tendência consolidada no setor empresarial. Segundo dados do Sebrae (2024), micro e pequenas empresas que adotam soluções digitais para gestão de processos registram redução significativa no tempo de atendimento e nos erros operacionais. No setor de motocicletas, a gestão manual por planilhas e documentos físicos ainda é recorrente, especialmente em pequenas locadoras e revendas, o que representa um problema de eficiência e rastreabilidade que o EzMotoFlow se propõe a resolver.

De acordo com Flanagan (2020), aplicações do tipo Single Page Application (SPA) proporcionam uma experiência de usuário mais fluida ao eliminar recarregamentos completos de página, delegando ao JavaScript a responsabilidade de renderização e navegação. Essa abordagem, adotada no EzMotoFlow, requer uma separação clara entre cliente (frontend) e servidor (backend), com comunicação via APIs RESTful.

"O padrão REST estabelece um conjunto de restrições arquiteturais que, quando aplicadas como um todo, enfatizam a escalabilidade das interações entre componentes, a generalidade das interfaces, a implantação independente dos componentes e componentes intermediários para reduzir a latência de interação, aplicar segurança e encapsular sistemas legados." (FIELDING, 2000)

Esse modelo arquitetural fundamenta diretamente a estrutura do EzMotoFlow, no qual o backend expõe uma API REST consumida pelo frontend, mantendo as camadas desacopladas e facilitando tanto a manutenção quanto a evolução independente de cada parte do sistema.

### 6.2. SISTEMAS SEMELHANTES

Para embasar o desenvolvimento do EzMotoFlow, foram identificados e analisados sistemas com características próximas à proposta deste projeto, avaliando suas funcionalidades, limitações e o público-alvo atendido.

#### 6.2.1. WebMotors Pro

O WebMotors Pro é uma plataforma voltada para a compra e venda de veículos, com funcionalidades de cadastro de anúncios, gerenciamento de clientes e contratos. No entanto, seu foco está predominantemente no segmento de automóveis, com pouca personalização para o mercado de motocicletas. O EzMotoFlow diferencia-se por ter sido desenvolvido especificamente para esse segmento, com controle detalhado de contratos, estoque e permissões de usuário.

#### 6.2.2. Autoline Dealer

O Autoline Dealer é um sistema completo para concessionárias, contemplando gestão de vendas, contratos, estoque e integração com redes sociais. Contudo, é uma solução direcionada a grandes concessionárias, tornando-se pouco acessível para pequenas lojas em termos de custo e complexidade. O EzMotoFlow prioriza a usabilidade e a simplicidade, sendo adequado para negócios de pequeno e médio porte sem equipe técnica dedicada.

#### 6.2.3. Rentcars

O Rentcars é um sistema voltado para locadoras de veículos, com foco em contratos de aluguel, controle de frota e documentos digitais. Sua limitação está no escopo restrito à locação, sem contemplar processos de compra, venda ou troca de veículos. O EzMotoFlow abrange um escopo mais amplo, integrando gestão de contratos com diferentes finalidades, controle de estoque e gerenciamento de clientes em uma única plataforma.

#### 6.2.4. HubSpot CRM

O HubSpot CRM, em seu módulo de vendas, oferece gerenciamento de clientes, contratos e automação de processos comerciais. Trata-se, porém, de uma solução genérica, sem adaptação específica para o setor de motocicletas e sem controle de estoque de veículos. O diferencial do EzMotoFlow está na integração entre contratos digitais, gestão de veículos e controle de permissões por usuário, com foco direto neste nicho de mercado.

#### 6.2.5. Revenda Mais

O Revenda Mais é uma plataforma nacional que oferece controle de estoque, cadastro de veículos com fotos e documentos, e geração de contratos. Embora seja uma solução robusta, atende diferentes portes e segmentos de lojas, sem o foco específico em motocicletas. O EzMotoFlow busca maior simplicidade e personalização para lojas de motocicletas de pequeno e médio porte, com um sistema de permissões granular por usuário que não está presente nas soluções analisadas.

### 6.3. FERRAMENTAS PARA DESENVOLVIMENTO

#### 6.3.1. TypeScript

O TypeScript é uma linguagem de programação de código aberto desenvolvida pela Microsoft, lançada em 2012. Trata-se de um superconjunto tipado do JavaScript, ou seja, todo código JavaScript válido também é TypeScript válido, porém com a adição de um sistema de tipos estáticos opcionais, interfaces, enums, genéricos e outras construções que aumentam a previsibilidade e a segurança do código, especialmente em projetos de médio e grande porte (Microsoft, 2024).

De acordo com a documentação oficial da linguagem (TypeScript Docs, 2024), "TypeScript adiciona sintaxe adicional ao JavaScript para suportar uma integração mais estreita com seu editor. Detecta erros antecipadamente no seu editor." Isso significa que falhas de tipagem são identificadas em tempo de desenvolvimento, antes mesmo da execução da aplicação, reduzindo a ocorrência de bugs em produção.

O TypeScript é compilado para JavaScript puro antes da execução, sendo compatível com qualquer ambiente que suporte JavaScript — navegadores, Node.js ou outros runtimes. No EzMotoFlow, TypeScript foi adotado tanto no backend quanto no frontend, garantindo consistência entre as camadas e permitindo que os contratos de dados sejam verificados automaticamente pelo compilador.

#### 6.3.2. NestJS

O NestJS é um framework Node.js para construção de aplicações server-side eficientes, confiáveis e escaláveis. Foi criado por Kamil Myśliwiec e lançado em 2017, sendo construído sobre TypeScript nativamente e baseado por padrão no framework Express, podendo também utilizar Fastify como alternativa de maior desempenho (NestJS Docs, 2024).

Segundo a documentação oficial (NestJS, 2024), "NestJS fornece uma arquitetura de aplicação pronta para uso que permite aos desenvolvedores e equipes criar aplicações altamente testáveis, escaláveis, com baixo acoplamento e de fácil manutenção."

O framework é fortemente inspirado na arquitetura do Angular e organiza a aplicação em módulos, controllers e providers. O uso de decoradores TypeScript permite que o sistema de injeção de dependências monte automaticamente o grafo de objetos da aplicação, eliminando a necessidade de instanciar manualmente serviços ou repositórios.

No EzMotoFlow, o NestJS estrutura os módulos de autenticação, usuários, motocicletas, clientes, contratos, armazenamento em nuvem e envio de e-mails, cada um encapsulando suas responsabilidades de forma coesa e independente.

#### 6.3.3. React

O React é uma biblioteca JavaScript de código aberto mantida pelo Meta (anteriormente Facebook) para a construção de interfaces de usuário baseadas em componentes. Lançada em 2013, tornou-se a biblioteca frontend mais utilizada no mundo, com ampla adoção tanto em projetos open source quanto em grandes organizações (React Docs, 2024).

De acordo com a documentação oficial (React, 2024), "React permite construir interfaces de usuário a partir de peças individuais chamadas componentes. Crie seus próprios componentes React, então combine-os em telas, páginas e aplicativos inteiros."

O React adota o paradigma de programação declarativa: o desenvolvedor descreve como a interface deve ser em função do estado atual dos dados, e a biblioteca se encarrega de atualizar eficientemente o DOM real por meio de um DOM virtual. Com a introdução dos React Hooks, o gerenciamento de estado e ciclo de vida passou a ser possível em componentes funcionais, simplificando a escrita e a legibilidade do código.

No EzMotoFlow, o React é a base de toda a interface do usuário, organizada em páginas, componentes reutilizáveis e hooks customizados que encapsulam a lógica de acesso a dados e o controle de permissões.

#### 6.3.4. Vite

O Vite é uma ferramenta de build moderna para projetos frontend, criada por Evan You — também criador do Vue.js — e lançada em 2020. Diferencia-se de ferramentas tradicionais como o Webpack por utilizar ES Modules nativos do navegador durante o desenvolvimento, proporcionando tempos de inicialização extremamente rápidos e atualização de módulos em tempo real (Hot Module Replacement — HMR) praticamente instantânea (Vite Docs, 2024).

Segundo a documentação oficial (Vite, 2024), "O Vite melhora o tempo de inicialização do servidor de desenvolvimento dividindo os módulos em duas categorias: dependências e código-fonte. [...] O código-fonte é servido sobre ESM nativo."

Em produção, o Vite utiliza o Rollup para gerar bundles otimizados com code splitting e tree shaking, eliminando código não utilizado do pacote final. No EzMotoFlow, o Vite é responsável por compilar os arquivos TypeScript e TSX e gerar os artefatos de produção do frontend.

#### 6.3.5. TailwindCSS e shadcn/ui

O TailwindCSS é um framework CSS utilitário que disponibiliza classes de baixo nível — de layout, espaçamento, tipografia e cor — para estilização direta no HTML ou JSX, eliminando a necessidade de criar arquivos CSS personalizados na maioria dos casos (TailwindCSS Docs, 2024). Wathan (2022), criador do framework, afirma que "ao contrário de outros frameworks CSS, o Tailwind não oferece componentes pré-construídos, oferecendo classes utilitárias de baixo nível que permitem construir designs completamente customizados."

O shadcn/ui é uma coleção de componentes React acessíveis, construídos sobre o Radix UI — primitivos de interface headless e sem estilos — e estilizados com TailwindCSS. Diferentemente de bibliotecas de componentes tradicionais, seus componentes são copiados diretamente para o projeto, garantindo controle total sobre o código e facilitando personalizações. No EzMotoFlow, o shadcn/ui fornece formulários, modais, tabelas, botões e menus, mantendo consistência visual e acessibilidade em toda a interface.

#### 6.3.6. PostgreSQL

O PostgreSQL é um sistema gerenciador de banco de dados objeto-relacional de código aberto, com mais de 35 anos de desenvolvimento ativo. É amplamente reconhecido por sua robustez, conformidade com os padrões SQL, suporte a transações ACID, chaves estrangeiras, triggers, views, stored procedures e tipos de dados avançados como JSON/JSONB (PostgreSQL Docs, 2024).

De acordo com a documentação oficial (PostgreSQL, 2024), "PostgreSQL é um poderoso sistema de banco de dados relacional de objeto de código aberto com mais de 35 anos de desenvolvimento ativo que lhe rendeu uma forte reputação de confiabilidade, robustez de recursos e desempenho."

O sistema utiliza MVCC (Multi-Version Concurrency Control) para gerenciar concorrência sem bloqueios excessivos, sendo adequado para aplicações com múltiplos acessos simultâneos. No EzMotoFlow, o PostgreSQL armazena todas as entidades do sistema — usuários, motocicletas, clientes, contratos e permissões.

#### 6.3.7. Prisma ORM

O Prisma é um ORM (Object-Relational Mapper) de nova geração para Node.js e TypeScript, composto por três ferramentas principais: o Prisma Schema (arquivo de definição do modelo de dados), o Prisma Migrate (ferramenta de migração versionada) e o Prisma Client (cliente de banco de dados gerado automaticamente e totalmente tipado) (Prisma Docs, 2024).

Segundo a documentação oficial (Prisma, 2024), "Prisma Client é um construtor de queries gerado automaticamente e com segurança de tipos que é adaptado ao seu esquema de dados. [...] Ele expõe uma API limpa e orientada ao desenvolvedor que abstrai a complexidade de interagir com o banco de dados."

O Prisma adota a abordagem "schema-first": o desenvolvedor define os modelos em um arquivo de schema declarativo, e a ferramenta gera automaticamente o cliente de banco de dados tipado. O sistema de migrações garante rastreabilidade e reprodutibilidade das evoluções do esquema. No EzMotoFlow, o Prisma é a camada de acesso a dados de todos os módulos do backend, oferecendo verificação de tipos em todas as operações de leitura e escrita no banco.

#### 6.3.8. Amazon S3

O Amazon Simple Storage Service (S3) é um serviço de armazenamento de objetos oferecido pela Amazon Web Services (AWS), amplamente utilizado para armazenamento de arquivos como imagens, vídeos e documentos. O serviço oferece alta durabilidade (99,999999999%), disponibilidade e integração com outros serviços da AWS, além de políticas de acesso granulares (AWS Documentation, 2024).

De acordo com a documentação da AWS (2024), "O Amazon S3 armazena dados como objetos dentro de buckets. Um objeto é um arquivo e todos os metadados que descrevem esse arquivo. Para armazenar um objeto no Amazon S3, você faz upload do arquivo que deseja armazenar no bucket."

No EzMotoFlow, o Amazon S3 é utilizado para armazenar as fotos das motocicletas (até três por veículo) e os arquivos PDF dos contratos gerados pelo sistema. A integração é realizada por meio do AWS SDK v3 para Node.js, encapsulada em um módulo dedicado do backend.

#### 6.3.9. Arquitetura Modular e Padrão MVC

A arquitetura do EzMotoFlow é baseada no padrão MVC (Model-View-Controller), adaptado ao contexto de aplicações web com separação entre cliente e servidor. No backend, o NestJS implementa o MVC de forma modular: os Controllers recebem e direcionam as requisições HTTP, os Services contêm a lógica de negócio, e os Models são representados pelos esquemas do Prisma que mapeiam as entidades do banco de dados.

Segundo a DevMedia (2024), "o padrão MVC permite ao desenvolvedor uma boa organização do código da aplicação ao dividi-la em três partes independentes, permitindo manutenção, atualização e até reuso em outros projetos." No frontend, o React assume o papel da camada View, enquanto os hooks e services encapsulam a lógica de acesso a dados, mantendo os componentes voltados exclusivamente para a renderização da interface.

---

## 7. METODOLOGIA

Para o desenvolvimento deste projeto, foi adotada uma pesquisa aplicada, combinando abordagens qualitativa e quantitativa. A fase inicial consistiu no levantamento dos processos operacionais típicos de lojas de motocicletas de pequeno e médio porte, identificando os principais requisitos funcionais e não funcionais que o sistema deveria atender. Com base nesse levantamento, foram elaborados os modelos de dados e os protótipos de interface, seguidos da implementação da solução.

O desenvolvimento foi conduzido de forma iterativa, com ciclos curtos de planejamento, implementação e testes, possibilitando ajustes contínuos ao longo do processo. Após cada ciclo, o comportamento do sistema era avaliado em relação aos requisitos levantados, garantindo aderência às necessidades identificadas. Após a conclusão do desenvolvimento, o sistema foi testado para verificar a usabilidade, a eficiência e a completude funcional definidas nos objetivos.

A estrutura do projeto foi organizada em dois projetos principais — backend e frontend —, cada um com seu próprio conjunto de dependências, configurações e scripts de execução.

### 7.1. ARQUITETURA DO SISTEMA

O EzMotoFlow adota uma arquitetura cliente-servidor com separação de camadas, organizada em dois projetos distintos que se comunicam via protocolo HTTP por meio de uma API RESTful:

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

No backend, a arquitetura segue o padrão modular do NestJS, com cada domínio de negócio encapsulado em um módulo independente. Cada módulo é composto por um Controller, responsável por receber e validar as requisições HTTP, e um Service, responsável pela lógica de negócio e pela comunicação com o banco de dados. Os módulos implementados cobrem os domínios de autenticação, usuários, motocicletas, clientes, contratos, armazenamento em nuvem e envio de e-mails.

No frontend, a aplicação React é organizada em páginas, componentes reutilizáveis, hooks customizados, services e stores de estado global. O roteamento é gerenciado pelo React Router DOM v6, o estado assíncrono pelo TanStack React Query e a validação de formulários pelo React Hook Form em conjunto com Zod.

### 7.2. CONFIGURAÇÃO DO BACKEND

O backend foi desenvolvido em TypeScript com NestJS, utilizando o CLI oficial do framework para geração automática de módulos, controllers e services. O ponto de entrada da aplicação inicializa o servidor, configura os mecanismos de validação globais e habilita a documentação Swagger.

O módulo de autenticação implementa login via e-mail e senha, com hashing de senhas e geração de tokens JWT. Rotas protegidas exigem autenticação válida, e rotas que demandam permissão específica verificam se o usuário autenticado possui a combinação de recurso e ação necessária antes de processar a requisição.

A validação dos dados de entrada é realizada de forma centralizada pelo NestJS, por meio de pipes de validação e decoradores nos DTOs (Data Transfer Objects) de cada módulo. Exceções não tratadas são interceptadas por um filtro global, que padroniza as respostas de erro retornadas pela API.

### 7.3. CONFIGURAÇÃO DO BANCO DE DADOS

O processo de modelagem do banco de dados teve início com a definição dos modelos em um arquivo de schema declarativo, que descreve as entidades, seus campos, tipos, relações e restrições. A partir desse schema, o Prisma Migrate gerou e aplicou os arquivos SQL de migração versionados, garantindo rastreabilidade e reprodutibilidade do esquema em qualquer ambiente.

O banco de dados PostgreSQL armazena as seguintes entidades principais do sistema:

| Modelo | Descrição |
|---|---|
| Users | Usuários internos do sistema, com senha armazenada em hash bcrypt |
| UserPermission | Permissões por recurso (USERS, CLIENTS, MOTORCYCLES, CONTRACTS) e ação (READ, CREATE, UPDATE, DELETE) |
| MotorCycle | Cadastro de motocicletas com dados técnicos (placa, chassi, RENAVAM), valores e fotos |
| Clients | Clientes pessoa física (CPF) e pessoa jurídica (CNPJ) com endereço completo |
| Contracts | Contratos vinculando cliente e motocicleta, com PDF, status, forma de pagamento e token de assinatura |

O campo de assinaturas do modelo de Contratos é armazenado como tipo JSON nativo do PostgreSQL, aproveitando a flexibilidade do tipo JSONB para dados semi-estruturados relacionados à assinatura digital.

### 7.4. CONFIGURAÇÃO DO FRONTEND

O frontend foi desenvolvido com React 18 e TypeScript, utilizando o Vite como bundler e servidor de desenvolvimento. Os componentes de interface foram construídos com TailwindCSS e shadcn/ui, garantindo consistência visual e acessibilidade em toda a aplicação.

A comunicação com o backend é feita por meio da biblioteca Axios, encapsulada em arquivos de service organizados por domínio, facilitando a reutilização e o isolamento em testes. O TanStack React Query gerencia o ciclo de vida das requisições assíncronas, incluindo cache automático, estados de carregamento e erro. O estado global da aplicação é administrado com Zustand.

A validação dos formulários é conduzida pelo React Hook Form em conjunto com Zod, que define os schemas de validação de forma tipada e declarativa. A busca automática de endereço pelo CEP é realizada via a API pública ViaCEP, consultada diretamente pelo frontend.

### 7.5. SEGURANÇA

A segurança do sistema foi contemplada em múltiplas camadas. As senhas dos usuários são armazenadas com hash gerado por algoritmo de hashing adaptativo, nunca sendo persistidas em texto simples. A autenticação é stateless, baseada em JWT: o token gerado no login é armazenado no cliente e enviado no cabeçalho de autorização a cada requisição.

O controle de acesso é implementado por um sistema de permissões granular: cada usuário possui um conjunto de permissões definidas por uma combinação de recurso e ação. O mecanismo de controle de permissões do NestJS verifica essa combinação antes de processar qualquer requisição a rotas protegidas, impedindo acessos não autorizados às funcionalidades restritas.

Os tokens de assinatura de contratos possuem data de expiração configurável, garantindo que o link enviado ao cliente expire após um período determinado, inviabilizando o uso indevido de links antigos.

---

## 8. RESULTADOS E DISCUSSÃO

Como resultado do projeto, foram desenvolvidos e entregues os principais módulos do sistema web. A seguir, são descritas as funcionalidades implementadas em cada um deles.

### 8.1. MÓDULOS IMPLEMENTADOS

**Módulo de Autenticação e Usuários**

O sistema conta com login via e-mail e senha, geração de token JWT e controle de sessão no frontend por meio de cookies seguros. O módulo de usuários permite o cadastro de operadores com permissões individualizadas por recurso e ação, tornando o sistema adequado para empresas com múltiplos colaboradores em funções distintas. O painel de gerenciamento de permissões permite ao administrador definir, em tempo real, o que cada usuário pode visualizar ou modificar no sistema.

**Módulo de Motocicletas**

Permite o cadastro completo de veículos com informações técnicas (placa, chassi, RENAVAM, ano, cor, quilometragem), valores de compra, venda e tabela FIPE, e até três fotos por veículo armazenadas na nuvem. O controle de status (ativo, inativo, em andamento, vendido) possibilita rastrear o ciclo de vida de cada motocicleta na frota e impede a vinculação de veículos indisponíveis a novos contratos.

**Módulo de Clientes**

Suporta o cadastro de clientes pessoa física (CPF) e pessoa jurídica (CNPJ), com campos de contato, data de nascimento e endereço completo. A busca automática de endereço por CEP preenche os campos de logradouro, bairro, cidade e estado automaticamente, agilizando o processo de cadastro e reduzindo erros de digitação.

**Módulo de Contratos**

É o módulo central do sistema. Vincula um cliente a uma motocicleta, registra o valor, a forma de pagamento (boleto, cartão, pix) e o status do contrato (ativo, cancelado, finalizado). O sistema gera automaticamente o PDF do contrato e disponibiliza um link de assinatura digital ao cliente, com token de validade controlada e registro da assinatura no banco de dados.

**Dashboard**

A tela inicial apresenta indicadores consolidados sobre o estado da operação — total de motocicletas por status, contratos ativos e clientes cadastrados — proporcionando uma visão rápida do desempenho do negócio sem a necessidade de navegar entre múltiplas telas.

### 8.2. DISCUSSÃO

A escolha do NestJS para o backend mostrou-se adequada para um projeto dessa natureza. A estrutura modular do framework disciplina a organização do código desde o início, facilitando a manutenção e a incorporação de novas funcionalidades. O uso de mecanismos centralizados de validação e autenticação eliminou código repetitivo nos controllers, reduzindo o risco de inconsistências de segurança entre as diferentes rotas da API.

O Prisma acelerou o desenvolvimento da camada de dados de forma significativa. A geração automática do cliente tipado reduziu a ocorrência de erros relacionados a nomes de campos ou tipos incompatíveis, enquanto o sistema de migrações garantiu rastreabilidade das evoluções do esquema, permitindo reproduzir o ambiente de banco de dados em qualquer máquina com um único comando.

No frontend, a combinação de React Query com Axios mostrou-se eficiente para gerenciar o ciclo de vida das requisições assíncronas, com cache automático, refetch e estados de carregamento e erro sem boilerplate excessivo. O shadcn/ui acelerou o desenvolvimento dos componentes de interface, mantendo consistência visual e acessibilidade em todas as telas da aplicação.

Um aspecto relevante identificado é a dependência de serviços externos, como o Amazon S3 e o servidor SMTP, que precisam ser configurados adequadamente no ambiente de produção. A modularização desses serviços facilita a substituição futura por alternativas sem impactar os demais módulos da aplicação.

---

## 9. CONCLUSÃO

O objetivo deste projeto foi desenvolver uma solução eficiente para o controle e gerenciamento de motocicletas, clientes e contratos em lojas do segmento. Por meio do EzMotoFlow, buscou-se digitalizar processos que frequentemente são conduzidos de maneira manual e fragmentada, centralizando as informações em uma única plataforma e reduzindo a ocorrência de erros operacionais.

Durante o desenvolvimento, foi necessário compreender o ciclo operacional do negócio e os desafios decorrentes da dispersão das informações, da dificuldade no acompanhamento de contratos e da ausência de controle de acesso adequado para equipes com diferentes responsabilidades. Para endereçar esses problemas, foram implementados o cadastro centralizado de veículos e clientes, a geração automatizada de contratos em PDF, a assinatura digital por link tokenizado e o sistema de permissões granular por usuário.

Os principais desafios encontrados durante o desenvolvimento envolveram a implementação do fluxo de assinatura digital e a integração com os serviços externos. A superação desses obstáculos foi viabilizada pela escolha de tecnologias modernas e consolidadas — TypeScript, NestJS, React, Vite, TailwindCSS, PostgreSQL, Prisma e Amazon S3 — e pela adoção de uma arquitetura modular que facilita o isolamento e a resolução de problemas em cada parte do sistema.

O EzMotoFlow demonstra potencial para agilizar e otimizar a gestão operacional de lojas do segmento de motocicletas. O projeto estabelece ainda uma base sólida para futuras expansões, tais como:

- **Relatórios e exportação de dados:** geração de relatórios financeiros e operacionais em PDF ou Excel.
- **Notificações em tempo real:** implementação de WebSockets para alertas de novos contratos ou vencimentos.
- **Aplicativo móvel:** desenvolvimento de um cliente mobile consumindo a mesma API REST.
- **Integração com gateways de pagamento:** cobrança automatizada de contratos via provedores como Stripe ou Asaas.
- **Testes automatizados:** expansão da cobertura de testes unitários e de integração, com testes end-to-end.

---

## REFERÊNCIAS

- AWS DOCUMENTATION. **Amazon S3 — User Guide**. Amazon Web Services, 2024. Disponível em: https://docs.aws.amazon.com/s3.
- DEVMEDIA. **Introdução ao padrão MVC**. DevMedia, 2024. Disponível em: https://www.devmedia.com.br/introducao-ao-padrao-mvc/29308.
- FIELDING, Roy Thomas. **Architectural Styles and the Design of Network-based Software Architectures**. Dissertação de Doutorado — University of California, Irvine, 2000.
- FLANAGAN, David. **JavaScript: The Definitive Guide**. 7. ed. O'Reilly Media, 2020.
- JONES, M.; BRADLEY, J.; SAKIMURA, N. **RFC 7519 — JSON Web Token (JWT)**. IETF, 2015. Disponível em: https://www.rfc-editor.org/rfc/rfc7519.
- MICROSOFT. **TypeScript Documentation**. Microsoft, 2024. Disponível em: https://www.typescriptlang.org/docs.
- NESTJS. **NestJS Documentation — A progressive Node.js framework**. 2024. Disponível em: https://docs.nestjs.com.
- POSTGRESQL. **PostgreSQL Documentation**. The PostgreSQL Global Development Group, 2024. Disponível em: https://www.postgresql.org/docs.
- PRISMA. **Prisma ORM Documentation**. Prisma Data, Inc., 2024. Disponível em: https://www.prisma.io/docs.
- REACT. **React Documentation**. Meta Open Source, 2024. Disponível em: https://react.dev.
- SANTOS, A. B. **Automação de processos organizacionais com sistemas de Software: um estudo qualitativo**. Revista de Gestão e Tecnologia, v. 12, n. 3, 2023.
- SEBRAE. **Digitalização nas micro e pequenas empresas brasileiras**. Sebrae, 2024.
- TAILWINDCSS. **TailwindCSS Documentation**. Tailwind Labs, Inc., 2024. Disponível em: https://tailwindcss.com/docs.
- VITE. **Vite Documentation — Next Generation Frontend Tooling**. 2024. Disponível em: https://vitejs.dev.
- BRASIL. **Medida Provisória nº 2.200-2**, de 24 de agosto de 2001. Institui a Infraestrutura de Chaves Públicas Brasileira — ICP-Brasil. Brasília, DF, 2001.
