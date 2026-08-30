# 🛒 Microservice ShopFlow

Sistema de e-commerce desenvolvido com arquitetura de **microsserviços**, utilizando NestJS, TypeScript, PostgreSQL, Prisma, RabbitMQ e Docker.

O projeto foi desenvolvido com o objetivo de aplicar conceitos de **arquitetura distribuída**, comunicação entre serviços, mensageria, autenticação, processamento de pedidos e integração entre diferentes componentes de um sistema de vendas.

## 📌 Arquitetura

O sistema é dividido nos seguintes microsserviços:

```text
                    ┌─────────────────┐
                    │   MS Gateway    │
                    │     HTTP/API    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌───────────┐   ┌────────────┐
        │ MS Auth  │   │ MS Orders │   │ MS Products│
        └──────────┘   └─────┬─────┘   └────────────┘
                             │
                             ▼
                       ┌───────────┐
                       │ MS Stock  │
                       └───────────┘

                       ┌───────────┐
                       │ MS Payment│
                       └───────────┘

                     RCP / RabbitMQ
                    ─────────────────
                    Mensageria/Eventos
```

### Microsserviços

| Serviço | Responsabilidade |
|---|---|
| **ms-gateway** | Ponto de entrada da aplicação e exposição das APIs |
| **ms-auth** | Autenticação, login e geração/validação de JWT |
| **ms-products** | Gerenciamento dos produtos |
| **ms-stock** | Controle e validação do estoque |
| **ms-orders** | Criação e gerenciamento dos pedidos |
| **ms-payment** | Processamento e gerenciamento dos pagamentos |

## 🚀 Tecnologias

- **Node.js**
- **NestJS**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **RabbitMQ**
- **Docker**
- **Docker Compose**
- **JWT**
- **Swagger**
- **Jest**

## 📂 Estrutura do projeto

```text
microservice-loja/
│
├── apps/
│   ├── ms-gateway/
│   ├── ms-auth/
│   ├── ms-products/
│   ├── ms-stock/
│   ├── ms-orders/
│   └── ms-payment/
│
├── libs/
│   └── ...
|
├── test/
│   └── ...
│
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Autenticação

A autenticação é realizada pelo **ms-auth** utilizando **JWT**.

O fluxo básico é:

```text
Cliente
   │
   ▼
MS Gateway
   │
   ▼
MS Auth
   │
   ├── valida credenciais
   │
   └── gera JWT
   │
   ▼
Cliente recebe Token
```

O token posteriormente é utilizado pelo Gateway para proteger as rotas que necessitam de autenticação.

## 📦 Fluxo de pedidos

O fluxo principal do sistema envolve pedidos, estoque e pagamento.

```text
Cliente
   │
   ▼
MS Gateway
   │
   ▼
MS Orders
   │
   ├──────► MS Stock
   │          │
   │          └── Verifica disponibilidade
   │
   └──────► MS Payment
              │
              └── Processa pagamento
```

Caso algum produto não possua estoque suficiente, o pedido pode ser cancelado.

Após a confirmação do pagamento, os serviços envolvidos podem executar as operações necessárias para atualização do pedido e estoque.

## 🐇 RabbitMQ

O **RabbitMQ** é utilizado para comunicação assíncrona entre os microsserviços.

O projeto também possui configuração para:

- Exchanges
- Queues
- Routing Keys
- ACK
- NACK
- Requeue
- Retry
- Dead Letter Exchange (DLX)
- Dead Letter Queue (DLQ)

A utilização de mensageria permite desacoplar operações que não precisam de uma resposta imediata.

## 🗄️ Banco de dados

Cada microsserviço possui sua própria responsabilidade sobre os dados.

O projeto utiliza:

**PostgreSQL + Prisma ORM**

O Prisma é responsável por:

- Modelagem das entidades;
- Migrations;
- Geração do Prisma Client;
- Acesso ao banco de dados.

## 🐳 Docker

O projeto pode utilizar Docker para executar os serviços necessários para a aplicação.

Exemplo:

```bash
docker compose up -d
```

Para verificar os containers:

```bash
docker compose ps
```

Para visualizar os logs:

```bash
docker compose logs -f
```

Para parar os containers:

```bash
docker compose down
```

## ⚙️ Instalação

Clone o projeto:

```bash
git clone https://github.com/walkerpontes/ShopFlow-Microservice.git
```

Entre no diretório:

```bash
cd microservice-loja
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente de acordo com os microsserviços.

## 🗃️ Prisma

Para gerar os clientes Prisma:

```bash
npm run build:all
```

Para executar migrations em ambiente de desenvolvimento:

```bash
npm run migrate:auth
npm run migrate:products
npm run migrate:stock
npm run migrate:orders
npm run migrate:payment
```

Para puplar o banco de dados com dados iniciais (seed):

```bash
npm run seed:auth
npm run seed:products
npm run seed:stock
npm run seed:orders
npm run seed:payment
```

## ▶️ Executando o projeto

Para executar os microsserviços individualmente:

```bash
npm run start:gate
npm run start:auth
npm run start:products
npm run start:stock
npm run start:orders
npm run start:payment
```

Para executar os microsserviços juntos:

```bash
npm run start:all
```

Os scripts podem variar de acordo com a configuração do `package.json`.

## 🧪 Testes

O projeto utiliza **Jest** para testes.

Executar os testes:

```bash
npm test
```

Executar os testes em modo watch:

```bash
npm run test:watch
```

Executar os testes com cobertura:

```bash
npm run test:cov
```

## 🔄 CI/CD

O projeto utiliza **GitHub Actions** para automatizar o processo de integração contínua.

O pipeline pode executar etapas como:

```text
Push / Pull Request
        │
        ▼
   GitHub Actions
        │
        ├── Instalar dependências
        │
        ├── Gerar Prisma Client
        │
        └── Build / Testes
                  │
            ┌─────┴─────┐
            ▼           ▼
            Sucesso      Falha
            │           │
            ▼           ▼
         Pipeline      Pipeline
            aprovado     interrompido
```

Dessa forma, alterações podem ser verificadas automaticamente antes de serem integradas ao projeto.

## 📚 Documentação da API

A API pode ser documentada utilizando **Swagger**.

Após iniciar o Gateway, a documentação estará disponível na rota configurada no projeto.

Exemplo:

```text
http://localhost:3000/docs
```

> A porta e a rota exatas dependem da configuração atual do `ms-gateway`.

## 🎯 Objetivos do projeto

Este projeto tem como principais objetivos:

- Aplicar arquitetura de microsserviços;
- Trabalhar comunicação síncrona e assíncrona;
- Implementar autenticação com JWT;
- Utilizar mensageria com RabbitMQ;
- Trabalhar com PostgreSQL e Prisma;
- Implementar controle de estoque;
- Implementar fluxo de pedidos e pagamentos;
- Aplicar testes automatizados;
- Utilizar Docker para infraestrutura;
- Implementar CI/CD com GitHub Actions;
- Praticar conceitos de sistemas distribuídos.

## 👨‍💻 Projeto

**Microservice ShopFlow**

Arquitetura baseada em microsserviços utilizando NestJS e tecnologias modernas do ecossistema Node.js.