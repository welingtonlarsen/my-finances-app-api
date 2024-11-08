# My Finances API

## ⚠️ Disclaimer

Since the beginning of my career, I’ve been studying and implementing Object-Oriented Programming (OOP). However, when I transitioned into the startup development world, I encountered a vastly different environment. In many cases, backends are implemented in a “go horse” style, often bypassing established design patterns like OOP or functional programming. I’ve observed several reasons for this approach, with the main ones being:

- A mix of developer experience levels and a lack of mentorship
- Full-stack developers with limited knowledge of backend architecture
- Pressure to deliver company results quickly, driving rapid valuation growth

This project is a proof of concept (POC) that attempts to emulate the practical challenges often seen in Node.js projects by deliberately not adhering to strict patterns. Instead, the focus is on:

- Keeping the project straightforward and accessible for all experience levels
- Avoiding excessive decoupling (as in real-world scenarios, it’s rare to swap out databases, frameworks, or libraries frequently)
- Facilitating test implementation, even without heavy dependency inversion or extensive decoupling

## Project description

This project provides the backend for the My Finances APP and is built with Node.js, Express, PostgreSQL and Prisma ORM.

## Prisma ORM commands

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
