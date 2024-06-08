# Whale Wave Bill Service

## Usage

### Install

```bash
yarn

yarn start:dev
```

### Nest Cli

create module

```bash
nest g res <module_name>
```

### Migration

init migration by postgresql

```bash
pnpm m:gen -n <migration-name>
```

create migration

```bash
pnpm m:create -n <migration-name>
```

revert migration one step

```bash
pnpm m:revert
```

### Swagger

[json同步地址](http://localhost:3001/doc-json)

## Recommended version

> NodeJs version 18.19.0  
> Yarn version 1.19.2

## Related documents

- [class-validator](https://github.com/typestack/class-validator)
- [nest-swagger](https://docs.nestjs.com/openapi/types-and-parameters#enums-schema)
- [nest-swagger-plugin](https://docs.nestjs.com/openapi/cli-pluginv)
