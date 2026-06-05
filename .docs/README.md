# Refactorización: Clean Architecture (INFO1156-AC_06)

## Información del Grupo

- **Enlace de la Pull Request Base:** https://github.com/INF-UCT/INFO1156-AC_06-Clean-Architecture
- **Integrantes:**
    - Bárbara Arriagada
    - Jaime Levil
    - Leonardo Chavez
    - Alan Bernales

---

## 1. Problemas Identificados (Diagnóstico Arquitectónico)

El sistema original operaba bajo un diseño monolítico fuertemente acoplado, violando la **Regla de Dependencia** de la Arquitectura Limpia:

- **Contaminación del Dominio por Infraestructura:** Los servicios (Capa de Negocio) inyectaban directamente `PrismaService`. Esto ataba la lógica core a un ORM específico y a SQLite, imposibilitando las pruebas unitarias aisladas y vulnerando el Principio de Inversión de Dependencias (DIP).
- **Fuga de DTOs HTTP al Núcleo:** La lógica de lectura del Feed (`PostsService.getFeedPosts`) y los constructores recibían parámetros acoplados al framework de red (`@nestjs/swagger` y `class-validator`), mezclando los mecanismos de entrega con las reglas de aplicación.
- **Falta de Puertos (Abstracciones):** El controlador dependía de clases concretas (`PostsService`) en lugar de contratos abstractos, generando un acoplamiento rígido de extremo a extremo.

---

## 2. Implementación de Clean Architecture (Slicing Vertical)

El equipo refactorizó el sistema dividiendo el trabajo por dominios funcionales (Slicing Vertical). Cada integrante garantizó que el flujo de dependencias apuntara exclusivamente hacia las capas internas (Dominio y Casos de Uso).

### A. Subsistema de Lectura y Feed Strategy (Jaime Levil)

Se aisló la lógica compleja de obtención y ordenamiento del feed, purgando las dependencias del framework HTTP y de la base de datos.

**Solución Estructural:**

1. **Contratos de Entrada Puros (`get-feed.input.ts`):** Se definió una estructura de datos inerte (`GetFeedInput`) para recibir los parámetros del cliente, eliminando la dependencia de `FeedQueryDto` dentro del caso de uso.
2. **Puerto de Salida (`post.repository.interface.ts`):** Se creó la interfaz `IPostRepository` en la Capa de Dominio. El caso de uso dicta el contrato que la base de datos debe cumplir, invirtiendo el control.
3. **Núcleo de Aplicación (`get-feed.use-case.ts`):** Orquestador puro que inyecta la interfaz del repositorio y delega el cálculo matemático al `FeedRankingStrategyFactory`. Ignora por completo la existencia de Prisma o NestJS.
4. **Adaptador de Datos (`prisma-post.repository.ts`):** Pertenece a la capa exterior de infraestructura. Implementa `IPostRepository` y ejecuta las consultas SQL reales mediante Prisma.
5. **Resolución IoC (`posts.module.ts`):** Se configuró el contenedor de inyección de dependencias para enlazar el token `'IPostRepository'` con la clase concreta `PrismaPostRepository`.

### Diagrama de Clases: Inversión de Dependencias en el Feed

El siguiente diagrama Mermaid demuestra cómo el flujo de control sale hacia la infraestructura (ejecución de DB), mientras que las dependencias de código fuente apuntan estrictamente hacia el núcleo.

```mermaid
classDiagram
    namespace CapaAplicacion {
        class GetFeedUseCase {
            -postRepository: IPostRepository
            -feedRankingFactory: FeedRankingStrategyFactory
            +execute(input: GetFeedInput)
        }
        class GetFeedInput {
            <<type>>
            +mode: string
            +categoryId?: string
        }
    }

    namespace CapaDominio {
        class IPostRepository {
            <<interface>>
            +getFeedPosts(categoryId?: string)
        }
    }

    namespace CapaInfraestructura {
        class PostsController {
            -getFeedUseCase: GetFeedUseCase
            +getFeed(query: FeedQueryDto)
        }
        class PrismaPostRepository {
            -prisma: PrismaService
            +getFeedPosts(categoryId?: string)
        }
    }

# Alan - Aislamiento del Motor de Moderación

## Resumen
Se refactorizó el módulo `moderation` aplicando **Clean Architecture**, logrando separar de forma estricta la lógica pura de negocio (dominio) de la capa de persistencia de datos e infraestructura.

---

## Archivos Creados

### 1. Capa de Dominio (`src/moderation/domain/`)
Contiene las reglas de negocio puras y contratos fundamentales. No tiene decoradores de NestJS ni dependencias externas.

* **`interfaces/content-moderator.interface.ts`** Define el contrato formal que debe cumplir cualquier motor de moderación de contenido:
    ```typescript
    export interface IContentModerator {
        moderate(text: string): boolean
    }
    ```
* **`services/fuzzy-moderator.service.ts`** Servicio de dominio puro que implementa la lógica de moderación *fuzzy* mediante expresiones regulares (`regex`). Expone los métodos `loadWords()` para cargar las palabras prohibidas en memoria y `moderate()` para evaluar la validez de un texto.

### 2. Capa de Aplicación (`src/moderation/application/`)
Orquesta los flujos de trabajo del sistema e interactúa con los puertos del dominio.

* **`ports/prohibited-word.repository.interface.ts`** Interfaz/Puerto que abstrae el acceso a datos para la gestión de palabras prohibidas:
    * `save(word, category)`: Persiste una nueva palabra en el sistema.
    * `findAll()`: Retorna la lista completa de palabras con sus respectivos metadatos.
* **`use-cases/add-prohibited-word.use-case.ts`** Caso de uso encargado de agregar una palabra prohibida, inyectando de manera desacoplada la interfaz `IProhibitedWordRepository`.
* **`use-cases/get-prohibited-words.use-case.ts`** Caso de uso encargado de recuperar y listar todas las palabras prohibidas.

### 3. Capa de Infraestructura (`src/moderation/infrastructure/`)
Contiene los detalles de implementación tecnológica externos al dominio.

* **`repositories/prisma-prohibited-word.repository.ts`** Implementación concreta del puerto `IProhibitedWordRepository` utilizando el ORM **Prisma**. Queda registrada en el módulo bajo el token de inyección `"IProhibitedWordRepository"`.

---

## Archivos Modificados

* **`moderation.service.ts`** * Se modificó para inyectar `FuzzyModeratorService` además del `PrismaService`.
    * El método `moderate()` ahora delega la evaluación de coincidencia por expresiones regulares directamente al servicio de dominio `FuzzyModeratorService`, eliminando la duplicidad de lógica.
* **`moderation.module.ts`** * Registra `FuzzyModeratorService` como `provider`.
    * Registra `PrismaProhibitedWordRepository` mapeado al token `"IProhibitedWordRepository"`.
    * Registra los casos de uso `AddProhibitedWordUseCase` y `GetProhibitedWordsUseCase` a través de fábricas (`useFactory`).
    * Exporta todos los servicios y utilidades necesarias para el consumo por parte de otros módulos de la aplicación.

---

## Migración de Base de Datos

Se generó y aplicó la migración `20260606000000_fix_uuid_ids`. Esta recrea de forma limpia todas las tablas utilizando identificadores de tipo `TEXT` (UUID) en lugar de un autoincremental `INTEGER`. Con esto se alinea el comportamiento nativo del motor SQLite con las decoraciones `@default(uuid())` definidas en los esquemas de Prisma.

---

## Estructura Final del Módulo

```text
src/moderation/
├── domain/
│   ├── interfaces/
│   │   └── content-moderator.interface.ts   ← NUEVO
│   └── services/
│       └── fuzzy-moderator.service.ts        ← NUEVO
├── application/
│   ├── ports/
│   │   └── prohibited-word.repository.interface.ts  ← NUEVO
│   └── use-cases/
│       ├── add-prohibited-word.use-case.ts   ← NUEVO
│       └── get-prohibited-words.use-case.ts  ← NUEVO
├── infrastructure/
│   └── repositories/
│       └── prisma-prohibited-word.repository.ts  ← NUEVO
├── moderation.module.ts                      ← MODIFICADO
└── moderation.service.ts                     ← MODIFICADO
    PostsController --> GetFeedUseCase : Invoca
    PostsController ..> GetFeedInput : Mapea DTO a Input puro
    GetFeedUseCase --> IPostRepository : Depende de la abstracción
    PrismaPostRepository ..|> IPostRepository : Implementa (DIP)
```
