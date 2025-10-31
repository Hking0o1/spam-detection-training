-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can insert/update/delete roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Remove role column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Update handle_new_user function to assign 'user' role by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Assign default 'user' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Drop old overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can manage campaign_clicks" ON public.campaign_clicks;
DROP POLICY IF EXISTS "Authenticated users can view campaign_clicks" ON public.campaign_clicks;
DROP POLICY IF EXISTS "Authenticated users can manage quiz_responses" ON public.quiz_responses;
DROP POLICY IF EXISTS "Authenticated users can view quiz_responses" ON public.quiz_responses;
DROP POLICY IF EXISTS "Authenticated users can manage training_completions" ON public.training_completions;
DROP POLICY IF EXISTS "Authenticated users can view training_completions" ON public.training_completions;

-- Create admin-only policies for campaign_clicks
CREATE POLICY "Admins can view all campaign_clicks"
ON public.campaign_clicks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert campaign_clicks"
ON public.campaign_clicks
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update campaign_clicks"
ON public.campaign_clicks
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete campaign_clicks"
ON public.campaign_clicks
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin-only policies for quiz_responses
CREATE POLICY "Admins can view all quiz_responses"
ON public.quiz_responses
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert quiz_responses"
ON public.quiz_responses
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update quiz_responses"
ON public.quiz_responses
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quiz_responses"
ON public.quiz_responses
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin-only policies for training_completions
CREATE POLICY "Admins can view all training_completions"
ON public.training_completions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert training_completions"
ON public.training_completions
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update training_completions"
ON public.training_completions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete training_completions"
ON public.training_completions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update employees table policies to admin-only
DROP POLICY IF EXISTS "Users can view their own employees" ON public.employees;
DROP POLICY IF EXISTS "Users can insert their own employees" ON public.employees;
DROP POLICY IF EXISTS "Users can update their own employees" ON public.employees;
DROP POLICY IF EXISTS "Users can delete their own employees" ON public.employees;

CREATE POLICY "Admins can view all employees"
ON public.employees
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert employees"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update employees"
ON public.employees
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete employees"
ON public.employees
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update campaigns table policies
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can insert their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;

CREATE POLICY "Admins can view all campaigns"
ON public.campaigns
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert campaigns"
ON public.campaigns
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update campaigns"
ON public.campaigns
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete campaigns"
ON public.campaigns
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update campaign_targets table policies
DROP POLICY IF EXISTS "Users can view their campaign targets" ON public.campaign_targets;
DROP POLICY IF EXISTS "Users can insert their campaign targets" ON public.campaign_targets;
DROP POLICY IF EXISTS "Users can update their campaign targets" ON public.campaign_targets;
DROP POLICY IF EXISTS "Users can delete their campaign targets" ON public.campaign_targets;

CREATE POLICY "Admins can view all campaign_targets"
ON public.campaign_targets
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert campaign_targets"
ON public.campaign_targets
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update campaign_targets"
ON public.campaign_targets
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete campaign_targets"
ON public.campaign_targets
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));