# Secure Shield Training Platform

A modern web application for managing cybersecurity awareness campaigns, employee training, and phishing simulations. Built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS.

## Features

- **Admin Dashboard:** View campaign stats, employee performance, and quiz results.
- **Campaign Management:** Create, schedule, and track phishing campaigns.
- **Employee Directory:** Filter, search, and manage employee records.
- **Training & Quizzes:** Deliver training modules and interactive quizzes.
- **Reports:** Generate and view detailed campaign and training reports.
- **Authentication:** Secure login for admins using Supabase.
- **Responsive UI:** Clean, accessible design with shadcn-ui and Tailwind CSS.

## Technologies

- [Vite](https://vitejs.dev/) – Fast development/build tool
- [React](https://react.dev/) – UI library
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [shadcn-ui](https://ui.shadcn.com/) – UI components
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS
- [Supabase](https://supabase.com/) – Backend/auth/database
- [Radix UI](https://www.radix-ui.com/) – Accessible UI primitives

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm run dev
   ```

3. **Lint your code:**
   ```sh
   npm run lint
   ```

4. **Build for production:**
   ```sh
   npm run build
   ```

## Project Structure

```
secure-shield-training/
├── src/
│   ├── components/         # UI and layout components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Supabase client and types
│   ├── pages/              # Route pages (Dashboard, Quiz, etc.)
│   ├── assets/             # Static assets
│   └── App.tsx             # Main app entry
├── public/                 # Static files
├── package.json            # Project metadata and scripts
├── tailwind.config.ts      # Tailwind CSS config
├── vite.config.ts          # Vite config
└── README.md               # Project documentation
```



## License

ISC

---

**Contributions and issues:**  
Feel free to open issues or pull requests on [GitHub](https://github.com/Hking0o1/secure-shield-training).
