### Prisma ORM commands

```bash
# generate ts client and models (already executed under the hood by above command)
yarn prisma:generate

# create empy migration
npx prisma migrate dev --create-only --name nameOfMigration

# create and execute migration
yarn prisma:migration:create nameOfMigration

# execute all migrations
yarn prisma:migration:execute:dev
```
