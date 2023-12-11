## JWT (JSON Web Token)

HS256 (HMAC-SHA256) and RS256 (RSA-SHA256) are both algorithms used for signing JWTs, but they work in different ways:

- HS256 uses a symmetric key algorithm. This means it uses the same secret key to **both sign and verify tokens**. This approach is simple and fast, but it requires you to securely share the secret key with any party that needs to verify your tokens.

- RS256 uses an asymmetric key algorithm. This means it uses a **private key to sign tokens** and a corresponding **public key to verify them**. This approach is more secure because you can distribute the public key widely without compromising the security of your tokens. However, it's also more computationally intensive.

RS256 can be particularly useful in a microservices architecture, where you might have many services that need to verify tokens but should not be able to generate them.

### Setup environment variables

```shell
cp .env.example .env
```

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

5. Paste both base64 encoded keys into the `.env` file:

```properties
JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=
```
