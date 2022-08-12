---
layout: post
title: Examples from Youtube video "Exploring Advanced TypeScript Concepts" by Headway
---

### Lookup types

A nested type inside another type

```ts
type Route = {
  origin: {...};
  destination: {...};
}

type Origin = Route['origin'];
type Destination = Route['destination'];
```

### Generics

```ts
export enum TaskType {
  feature = "feature",
  bug = "bug",
}

type Task<T = TaskType> = {
  name: string;
  type: T;
};

const whatever: Task = { name: "SSO", type: TaskType.feature };
```

### Extract Utility Function

```ts
type Trip =
  | { origin: { uuid: string; city: string; state: string } }
  | { originUuid: string };

type TripWithOriginRef = Extract<Trip, { originUuid: string }>;
type TripWithOriginWhole = Extract<Trip, { origin: { uuid: string } }>;

const tripOriginRef = { originUuid: "123" };
const tripOriginWhole = {
  origin: { uuid: "123", city: "Denvor", state: "Colorado" },
};

const isRef = (trip: Trip): trip is TripWithOriginRef => {
  return trip.hasOwnProperty("originUuid");
};

const isDraft = (trip: Trip): trip is TripWithOriginWhole => {
  return trip.hasOwnProperty("origin");
};

const result = [tripOriginRef, tripOriginWhole].filter(isRef);
```

### Conditional Types

```ts
type Diesel = {
  type: "petroleum" | "bio" | "synthetic";
};

type Gasoline = {
  type: "hybrid" | "conventional";
};

type Bus = {
  engine: Diesel;
};

type Car = {
  engine: Gasoline;
};

type Engine<T> = T extends { engine: unknown } ? T["engine"] : never;

type BusEngine = Engine<Bus>;

const bugEngine: BusEngine = {
  type: "bio",
};

const carEngine: Engine<Car> = {
  type: "hybrid",
};

type Bicycle = {
  power: "limbs";
};

type NoEngine = Engine<Bicycle>;

// const noEngine: NoEngine = { type: "limbs" };
// Type '{ type: string; }' is not assignable to type 'never'.ts(2322)

enum Priority {
  mustHave,
}

const backlog = {
  releases: [
    {
      name: "Sprint 1",
      epics: [
        {
          name: "Account Management",
          tasks: [
            { name: "SSO", priority: Priority.mustHave },
            { name: "Email Notifications", priority: Priority.mustHave },
          ],
        },
      ],
    },
  ],
};

type Unarray<T> = T extends Array<infer U> ? U : T;

type Release = Unarray<typeof backlog["releases"]>;
```

### Omit

```tsx
import React from "react";
import { Button, ButtonProps } from "@material-ui/core";

// you don't want people to change the variant of your button
type Props = Omit<ButtonProps, "variant">;

const BrandButton: React.FC<Props> = ({ children, variant, ...rest }) => {
  return <Button {...rest}>{children}</Button>;
};
```

`Pick` and `Omit` in TypeScript have same semantics with those in `lodash`, they work on types instead of objects.

- [ ] [`infer` keyword usage](https://learntypescript.dev/09/l2-conditional-infer)
- [x] [Exploring Advanced TypeScript Concepts](https://youtu.be/eJ6R1knfsoc)
