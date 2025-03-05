# Code of Conduct BE

This document is a set of rules and best practices that we follow in our projects. Those are not optional and should be followed by every developer.

## Table of contents

- [Structure](#structure)
- [Naming](#naming)
- [Objects](#objects)
- [Best Practices](#best-practices)
- [Links](#links)

## Structure

<em> <strong>
This structure is inspired by hexagonal architecture (we do not follow it strictly) with focus on separation of business domain. Idea is to separate core business domain from infrastructure (dbs/queues/APIs...) to be able to easily replace dependencies without changing business logic and to be able to test business logic without infrastructure.
</em></strong>

![code_of_conduct.png](./static/code_of_conduct.png)

`Port` is our facade (example.facade) <br>
`Adapter` is our implementation (example.repository) <br>
`Domain` is our business layer (example.service)

![code_of_conduct_1.png](./static/code_of_conduct_1.png)

In each module we can have more than one controller, service, repository, entity etc.

## Naming

1. Every file/class name should be singular.
   - Examples: `product.schema.ts`, `product.service.ts`, `time-zone-mapping.ts`, `course.repository.ts`

2. Every `module`/`service`/`entity`/`request`/`response`/`repository`/`transformer` file name is preceded by a dot (Nest standard). Every domain uses `kebab-case`.
   - Examples: `example.service.ts`, `example-user.service.ts`, `product-pricing.service.ts`, `legacy-meetings-times.transformers.ts`

3. Every method/variable should be written in `camelCase`.

4. All constants should be uppercase.
   - Example: `const VALID = [a, b, c]`

5. Do not use underscores (`_`) in file/method/argument names. Use minimal required words for describing objects (do not use non-descriptive words like data, object, all, etc.).

6. Use simple method names.
   - Examples: `getProductById`, `createProductByEmail`, `updateProduct`, `deleteProducts`

7. Don't use DTO naming.

## Objects

1. Use response and request objects: `UserResponse`, `CourseResponse`, `CreateProductRequest`, `UpdateProductRequest`

2. Every response and request body should be an object as a `class`, it is much easier to extend, validate, and annotate with Swagger.

3. For DB entities, we are using Prisma objects. If not Prisma, use the `Entity` suffix.
   - Examples: `ProductEntity`, `UserEntity`, `CourseEntity`
   - Files: `product.entity.ts`, `user.entity.ts`, `course.entity.ts`

4. For all domain/business objects, use `class` names without suffixes.
   - Examples: `Product`, `User`, `Course`
   - Files: `product.ts`, `user.ts`, `course.ts`

5. Use classes for `responses`, `requests`, and `entities`.

## Best Practices

1. Use `any` only when necessary, or in tests.

2. Use casting (`as string`, `as Product`) only when necessary, or in tests.

3. Don't use `else`; use `early return` instead. In loops, use `early continue`.

   - Example:

   **IF/ELSE NESTED**

   ```typescript
   if (user) {
     if (user.isAdmin) {
       // do something
     } else {
       // do something else
       if (user.isSuperAdmin) {
         // do something
       }
     }
   }
   ```

   **EARLY RETURN**

   ```typescript
   if (!user) {
     return;
   }
   if (user.isAdmin) {
     return 1; // do something
   }
   // do something else
   if (user.isSuperAdmin) {
     return 2; // do something
   }
   ```

4. If possible, create methods that will be used for multiple use cases without adding complexity.

   - Example:

   ```typescript
   updateProduct(updateProduct: Partial<Product> & { id: string }) {
     return update(product);
   }
   ```

   **INSTEAD OF**

   ```typescript
   updateProduct(id: string, email: string) {
     return update(id, email);
   }

   updateProduct(id: string, name: string) {
     return update(id, name);
   }

   updateProduct(id: string, someValue: string) {
     return update(id, someValue);
   }
   ```
6. Other rules

- Do not use `import type`

## Links

- https://medium.com/swlh/return-early-pattern-3d18a41bba8
- https://www.happycoders.eu/software-craftsmanship/hexagonal-architecture/
