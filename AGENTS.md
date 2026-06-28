# Project Rules

## Tech Stack

* React 18+
* TypeScript 5+ (strict mode enabled)
* React Router DOM v6
* Vite
* Styling: CSS Modules

---

## Folder Structure

src/
├── assets/
├── components/
├── layouts/
├── pages/
├── routes/
├── hooks/
├── services/
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css

---

## Routing Architecture

The application is a Client-Side Rendered SPA.

Render flow:

main.tsx
→ App.tsx
→ AppRouter
→ MainLayout
→ Outlet
→ Page
→ Components

Use a shared MainLayout with React Router's Outlet.

MainLayout responsibilities:

* Render Navbar
* Render Footer
* Render Outlet content

Pages responsibilities:

* Represent application routes
* Compose UI components
* Handle page-specific logic

Components responsibilities:

* Reusable UI pieces
* No routing logic

---

## Naming Conventions

### Folders

Use kebab-case.

Examples:

* user-profile/
* contact-form/

### React Components

Use PascalCase.tsx.

Examples:

* Navbar.tsx
* Footer.tsx
* HomePage.tsx

Always use:

export default ComponentName;

### Hooks

Use camelCase with use prefix.

Examples:

* useAuth.ts
* useIssPosition.ts

### Utilities

Use camelCase.ts.

Examples:

* formatDate.ts
* calculateDistance.ts

### Types

Located inside src/types.

Examples:

* User.ts
* ContactForm.ts

Never use I-prefixed interfaces.

Bad:

* IUser

Good:

* User

### Variables and Functions

Use camelCase.

Examples:

* handleSubmit
* fetchData
* currentUser

---

## Imports

Use absolute imports through @ alias.

Good:

import Navbar from '@/components/navbar/Navbar';

Bad:

import Navbar from '../../../components/navbar/Navbar';

Never use relative imports that go up more than one level.

---

## TypeScript Rules

* Strict mode required
* Never use any
* Every prop must have an interface
* Every function must have explicit typing when needed

Example:

interface ButtonProps {
label: string;
onClick: () => void;
}

const Button = ({ label, onClick }: ButtonProps) => {
return <button onClick={onClick}>{label}</button>;
};

export default Button;

---

## React Rules

* Use functional components only
* Use arrow functions only
* Export components as default exports
* Keep components focused on a single responsibility

---

## JSX Rules

Keep JSX clean.

Avoid:

* Complex conditions inline
* Large mapping expressions inline
* Business logic inside return blocks

Extract logic before return.

Bad:

return (
<>
{users.filter(x => x.active).map(...)}
</>
);

Good:

const activeUsers = users.filter(user => user.active);

return (
<>
{activeUsers.map(...)}
</>
);

---

## File Size Rules

If a file exceeds approximately 150 lines:

* Extract logic into custom hooks
* Split UI into subcomponents
* Move helper functions into utils

Avoid large monolithic files.

---

## Project Goal

Build a maintainable React SPA following clean architecture principles, strong TypeScript typing, reusable components, and scalable folder organization.
