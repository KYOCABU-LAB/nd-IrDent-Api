# Comandos del Proyecto

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Prisma Commands

```bash
# para crear un nuevo migration
$ npx prisma migrate dev --name migracion_nombre

# genera el  Prisma Client
$ npx prisma generate

# reseteas la base de datos
$ npx prisma migrate reset

# comando para aplicar migraciones guardadas en prisma
$ npx prisma migrate deploy

# para ver la base de datos en web con prisma studio
$ npx prisma studio

```
