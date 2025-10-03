# Secure Shield Training Platform

A comprehensive web application for managing cybersecurity awareness campaigns, employee training, and phishing simulations. This platform helps organizations strengthen their security posture through employee education and awareness training.

## Features

### Campaign Management
- **Create & Schedule Campaigns**: Design phishing simulation campaigns with customizable templates
- **Email Templates**: Pre-built templates for common phishing scenarios (banking alerts, IT support, CEO messages)
- **Template Management**: Create, edit, and delete email templates with full preview capabilities
- **Targeted Delivery**: Select specific employees or departments for campaign targeting
- **Bulk Email Sending**: Send phishing simulation emails to multiple employees simultaneously
- **Real-time Tracking**: Monitor campaign performance and employee interactions

### Employee Management
- **Employee Directory**: Comprehensive employee database with filtering and search capabilities
- **Department Organization**: Organize employees by departments (Sales, IT, HR, Finance, Marketing)
- **Bulk Import**: Upload employee data via CSV files for quick onboarding
- **Individual Selection**: Granular control over campaign targeting with individual employee selection
- **Status Tracking**: Monitor employee status and participation

### Training & Assessment
- **Interactive Quizzes**: Deliver cybersecurity awareness quizzes to test employee knowledge
- **Training Modules**: Provide educational content on security best practices
- **Multi-language Support**: Training available in multiple languages
- **Progress Tracking**: Monitor completion rates and performance metrics

### Analytics & Reporting
- **Campaign Analytics**: Track clicks, responses, and engagement metrics
- **Quiz Results**: View detailed quiz performance and scores
- **Employee Performance**: Monitor individual and departmental security awareness levels
- **Comprehensive Reports**: Generate detailed reports on campaign effectiveness

### Administration
- **Admin Dashboard**: Centralized view of all campaigns, employees, and performance metrics
- **Secure Authentication**: Supabase-powered authentication for admin access
- **Role-based Access**: Admin-only access to sensitive features and data

## Technology Stack

- **Frontend Framework**: [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn-ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/)
- **Email Service**: [Resend](https://resend.com/)
- **Serverless Functions**: Supabase Edge Functions

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account
- Resend account (for email functionality)

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Hking0o1/secure-shield-training.git
   cd secure-shield-training
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**
   - Set up your Supabase project credentials
   - Add your Resend API key for email functionality

4. **Start the development server**
   ```sh
   npm run dev
   ```

5. **Build for production**
   ```sh
   npm run build
   ```

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Project Structure

```
secure-shield-training/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn-ui components
│   │   ├── AdminLayout.tsx # Admin dashboard layout
│   │   ├── AuthProvider.tsx # Authentication wrapper
│   │   ├── BulkEmailSender.tsx # Bulk email functionality
│   │   └── BulkEmailUpload.tsx # CSV employee import
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Supabase client and types
│   ├── pages/              # Application pages/routes
│   │   ├── AdminDashboard.tsx
│   │   ├── CreateCampaign.tsx
│   │   ├── EmployeeDirectory.tsx
│   │   ├── QuizPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── TrainingPage.tsx
│   ├── assets/             # Static assets
│   └── App.tsx             # Main application entry
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── public/                 # Public static files
└── README.md
```

## Database Schema

### Tables
- **employees**: Employee information and department assignments
- **campaigns**: Phishing simulation campaigns and templates
- **campaign_targets**: Links campaigns to target employees
- **campaign_clicks**: Tracks employee interactions with campaign emails
- **quiz_responses**: Stores quiz results and scores
- **training_completions**: Tracks completed training modules
- **profiles**: Admin user profiles

## Email Configuration

The platform uses Resend for email delivery. To enable email functionality:

1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain
3. Create an API key
4. Add the `RESEND_API_KEY` to your Supabase Edge Function secrets

## Security Features

- Row-Level Security (RLS) policies on all database tables
- Secure authentication using Supabase Auth
- Admin-only access to sensitive operations
- Encrypted API keys and secrets management
- CORS protection on edge functions

## CSV Import Format

When importing employees via CSV, use the following format:

```csv
name,email,department
John Doe,john.doe@company.com,Sales
Jane Smith,jane.smith@company.com,Marketing
Mike Johnson,mike.johnson@company.com,IT
```

**Required columns**: name, email, department

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

ISC

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/Hking0o1/secure-shield-training/issues)
- Check the documentation in the `/docs` folder

---

**Important**: This platform is designed for security awareness training purposes only. All phishing simulations should be conducted with proper authorization and in accordance with your organization's policies.
