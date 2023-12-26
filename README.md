# Elysian

This application is the backend of a forum-like platform that allows users to share knowledge and ideas seamlessly.

It results from an in-depth study and implementation of SOLID principles, Clean Architecture, Domain-Driven Design (DDD), and Test-Driven Development (TDD).

## 🛠️ Technologies

- 💻 Language and Framework
    - TypeScript
    - NestJS
- 🔒 Authentication
    - JSON Web Token (RS256 Algorithm)
- ☁️ Storage
    - Cloudflare R2 (AWS S3 API)
- 💾 Databases
    - Postgres
    - Redis (Cache)
- 🐳 Containerization
    - Docker
- ✅ Testing
    - Vitest
    - SuperTest (E2E Tests)
    - Faker.js
- 🧹 Linting
    - ESLint
    - Prettier

## 📦 Installation

Node.js (v20.10.0) is required to install dependencies and run the project.

```sh
git clone git@github.com:bonizario/elysian.git && cd elysian
```

Install the `pnpm` package manager.

```sh
npm install -g pnpm
```

Install the project dependencies.

```sh
pnpm install
```

## 🔒 Environment variables

You can generate a private and public key pair using the `openssl` command in Linux/macOS:

1. Generate the private key:

```shell
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```

2. Generate the public key from the private key:

```shell
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

This will create a 2048-bit RSA private key (`private_key.pem`) and a corresponding public key (`public_key.pem`). Make sure to keep your private key secure.

3. Convert the private key to base64:

```shell
base64 -w 0 private_key.pem > private_key_base64.pem
```

4. Convert the public key to base64:

```shell
base64 public_key.pem > public_key_base64.pem
```

5. Copy the `.env.example` content into a new `.env` file:

```shell
cp .env.example .env
```

6. Paste both base64 encoded keys into the `.env` file and delete the generated files afterward:

```properties
JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=
```

## 💡 Key Concepts

### What is JSON Web Token (JWT)?

JSON Web Token (JWT) is a compact and self-contained method for securely transmitting information between parties as a JSON object.

This information can be verified and trusted because it is digitally signed (via one of the many cryptography algorithms available). The main difference between these algorithms is the type of key they use:

- Symmetric algorithms (HMAC) use a **secret key** for signing and verifying tokens. The key must be kept secure and shared between parties that need to verify the token.

- Asymmetric algorithms (RSA, ECDSA, EdDSA) use a **private key** for signing tokens and a corresponding **public key** for verifying them. The private key must be kept secure within the main service, while the public key can be freely distributed to any other party that needs to verify tokens but should not be able to generate them.

### Clean Architecture and Domain-Driven Design

#### Folder structure

```sh
tree -d -I 'node_modules|dist|build' --sort name -A -C
```

```
├── prisma
│   └── migrations
├── src
│   ├── core
│   │   ├── entities
│   │   ├── errors
│   │   ├── events
│   │   ├── repositories
│   │   └── types
│   ├── domain
│   │   ├── forum
│   │   │   ├── application
│   │   │   │   ├── cryptography
│   │   │   │   ├── repositories
│   │   │   │   ├── storage
│   │   │   │   └── use-cases
│   │   │   │       └── errors
│   │   │   └── enterprise
│   │   │       ├── entities
│   │   │       │   └── value-objects
│   │   │       └── events
│   │   └── notification
│   │       ├── application
│   │       │   ├── repositories
│   │       │   ├── subscribers
│   │       │   └── use-cases
│   │       └── enterprise
│   │           └── entities
│   └── infra
│       ├── auth
│       ├── cache
│       │   └── redis
│       ├── cryptography
│       ├── database
│       │   └── prisma
│       │       ├── mappers
│       │       └── repositories
│       ├── env
│       ├── events
│       ├── http
│       │   ├── controllers
│       │   ├── pipes
│       │   └── presenters
│       └── storage
└── test
    ├── cryptography
    ├── e2e
    ├── factories
    ├── repositories
    ├── storage
    └── utils
```
