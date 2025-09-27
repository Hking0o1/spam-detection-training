-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign_targets table (which employees are targeted)
CREATE TABLE public.campaign_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, employee_id)
);

-- Create campaign_clicks table (tracking clicks)
CREATE TABLE public.campaign_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE(campaign_id, employee_id)
);

-- Create training_completions table
CREATE TABLE public.training_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  language TEXT DEFAULT 'english',
  UNIQUE(campaign_id, employee_id)
);

-- Create quiz_responses table
CREATE TABLE public.quiz_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  responses JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, employee_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for all other tables (admin access only)
CREATE POLICY "Authenticated users can view employees" ON public.employees
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage employees" ON public.employees
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view campaigns" ON public.campaigns
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage campaigns" ON public.campaigns
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view campaign_targets" ON public.campaign_targets
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage campaign_targets" ON public.campaign_targets
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view campaign_clicks" ON public.campaign_clicks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage campaign_clicks" ON public.campaign_clicks
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view training_completions" ON public.training_completions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage training_completions" ON public.training_completions
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view quiz_responses" ON public.quiz_responses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage quiz_responses" ON public.quiz_responses
  FOR ALL TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.employees (name, email, department) VALUES
  ('John Smith', 'john.smith@company.com', 'Sales'),
  ('Sarah Johnson', 'sarah.johnson@company.com', 'IT'),
  ('Mike Wilson', 'mike.wilson@company.com', 'HR'),
  ('Lisa Chen', 'lisa.chen@company.com', 'Finance'),
  ('David Brown', 'david.brown@company.com', 'Marketing'),
  ('Emma Davis', 'emma.davis@company.com', 'Sales'),
  ('Alex Rodriguez', 'alex.rodriguez@company.com', 'IT'),
  ('Jennifer Taylor', 'jennifer.taylor@company.com', 'HR'),
  ('Robert Anderson', 'robert.anderson@company.com', 'Finance'),
  ('Maria Garcia', 'maria.garcia@company.com', 'Marketing'),
  ('Kevin Lee', 'kevin.lee@company.com', 'Sales'),
  ('Amanda White', 'amanda.white@company.com', 'IT'),
  ('Chris Thompson', 'chris.thompson@company.com', 'HR'),
  ('Jessica Martinez', 'jessica.martinez@company.com', 'Finance'),
  ('Daniel Kim', 'daniel.kim@company.com', 'Marketing');

-- Insert sample campaigns
INSERT INTO public.campaigns (name, template_type, subject, content, status) VALUES
  ('Banking Security Alert', 'security', 'Urgent: Verify Your Account', 'Your account has been compromised. Click here to verify your identity immediately.', 'completed'),
  ('IT Support Request', 'support', 'Action Required: Update Your Password', 'Our IT department requires you to update your password. Click the link below to proceed.', 'completed'),
  ('CEO Urgent Message', 'executive', 'Confidential: Immediate Action Required', 'This is an urgent message from the CEO. Please review the attached document immediately.', 'completed'),
  ('Payroll Update', 'hr', 'Important: Payroll System Changes', 'We are updating our payroll system. Please click here to verify your information.', 'active');

-- Insert sample campaign targets and clicks
DO $$
DECLARE
  campaign_record RECORD;
  employee_record RECORD;
  click_chance NUMERIC;
BEGIN
  FOR campaign_record IN SELECT id FROM public.campaigns LOOP
    FOR employee_record IN SELECT id FROM public.employees ORDER BY RANDOM() LIMIT 8 LOOP
      -- Insert campaign target
      INSERT INTO public.campaign_targets (campaign_id, employee_id) 
      VALUES (campaign_record.id, employee_record.id);
      
      -- Random chance of clicking (about 20% click rate)
      SELECT RANDOM() INTO click_chance;
      IF click_chance < 0.2 THEN
        INSERT INTO public.campaign_clicks (campaign_id, employee_id, ip_address, user_agent)
        VALUES (
          campaign_record.id, 
          employee_record.id,
          '192.168.1.' || FLOOR(RANDOM() * 255 + 1)::TEXT,
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        );
        
        -- 80% chance of completing training after clicking
        IF RANDOM() < 0.8 THEN
          INSERT INTO public.training_completions (campaign_id, employee_id, language)
          VALUES (campaign_record.id, employee_record.id, CASE WHEN RANDOM() < 0.7 THEN 'english' ELSE 'hindi' END);
          
          -- 90% chance of taking quiz after training
          IF RANDOM() < 0.9 THEN
            INSERT INTO public.quiz_responses (campaign_id, employee_id, score, total_questions, responses)
            VALUES (
              campaign_record.id, 
              employee_record.id,
              FLOOR(RANDOM() * 3 + 1)::INTEGER, -- Score 1-3
              3, -- Total questions
              '{"q1": "correct", "q2": "incorrect", "q3": "correct"}'::JSONB
            );
          END IF;
        END IF;
      END IF;
    END LOOP;
  END LOOP;
END $$;