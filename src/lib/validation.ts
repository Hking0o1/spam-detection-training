import { z } from 'zod';

// Campaign validation schemas
export const campaignNameSchema = z.string()
  .min(1, "Campaign name is required")
  .max(200, "Campaign name must be less than 200 characters")
  .regex(/^[a-zA-Z0-9\s\-_]+$/, "Campaign name can only contain letters, numbers, spaces, hyphens, and underscores");

export const emailSubjectSchema = z.string()
  .min(1, "Email subject is required")
  .max(200, "Email subject must be less than 200 characters");

export const emailContentSchema = z.string()
  .min(1, "Email content is required")
  .max(5000, "Email content must be less than 5000 characters");

// Employee validation schemas
export const employeeNameSchema = z.string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters");

export const employeeEmailSchema = z.string()
  .email("Invalid email address")
  .max(255, "Email must be less than 255 characters");

export const departmentSchema = z.string()
  .min(1, "Department is required")
  .max(100, "Department must be less than 100 characters");

// Complete employee schema for CSV uploads
export const employeeSchema = z.object({
  name: employeeNameSchema,
  email: employeeEmailSchema,
  department: departmentSchema,
});

// Campaign creation schema
export const campaignSchema = z.object({
  name: campaignNameSchema,
  subject: emailSubjectSchema,
  content: emailContentSchema,
  template_type: z.string().min(1, "Template type is required"),
});

// Helper function to sanitize HTML content
export const sanitizeHtmlContent = (content: string): string => {
  // Basic HTML sanitization - removes potentially dangerous tags
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Remove inline event handlers
    .replace(/on\w+='[^']*'/gi, '');
};

// Helper to prevent CSV injection
export const sanitizeCsvField = (field: string): string => {
  // CSV injection prevention - escape fields starting with =, +, -, @
  const trimmed = field.trim();
  if (trimmed.match(/^[=+\-@]/)) {
    return `'${trimmed}`;
  }
  return trimmed;
};
