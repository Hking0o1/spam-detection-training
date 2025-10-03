-- Add created_by column to employees table to link employees to the admin who created them
ALTER TABLE public.employees 
ADD COLUMN created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing employees to be owned by the first admin (temporary fix for existing data)
UPDATE public.employees 
SET created_by = (SELECT user_id FROM public.profiles LIMIT 1)
WHERE created_by IS NULL;

-- Make created_by NOT NULL after updating existing records
ALTER TABLE public.employees 
ALTER COLUMN created_by SET NOT NULL;

-- Update existing campaigns to be owned by the first admin (temporary fix for existing data)
UPDATE public.campaigns 
SET created_by = (SELECT user_id FROM public.profiles LIMIT 1)
WHERE created_by IS NULL;

-- Make campaigns created_by NOT NULL after updating existing records
ALTER TABLE public.campaigns 
ALTER COLUMN created_by SET NOT NULL;

-- Drop old employee RLS policies
DROP POLICY IF EXISTS "Authenticated users can manage employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;

-- Create new RLS policies that restrict access to only employees created by the logged-in user
CREATE POLICY "Users can view their own employees" 
ON public.employees 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own employees" 
ON public.employees 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own employees" 
ON public.employees 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own employees" 
ON public.employees 
FOR DELETE 
USING (auth.uid() = created_by);

-- Drop old campaign RLS policies
DROP POLICY IF EXISTS "Authenticated users can manage campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can view campaigns" ON public.campaigns;

-- Create new RLS policies for campaigns
CREATE POLICY "Users can view their own campaigns" 
ON public.campaigns 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own campaigns" 
ON public.campaigns 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own campaigns" 
ON public.campaigns 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own campaigns" 
ON public.campaigns 
FOR DELETE 
USING (auth.uid() = created_by);

-- Update campaign_targets RLS to only show targets for campaigns owned by the user
DROP POLICY IF EXISTS "Authenticated users can manage campaign_targets" ON public.campaign_targets;
DROP POLICY IF EXISTS "Authenticated users can view campaign_targets" ON public.campaign_targets;

CREATE POLICY "Users can view their campaign targets" 
ON public.campaign_targets 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns 
    WHERE campaigns.id = campaign_targets.campaign_id 
    AND campaigns.created_by = auth.uid()
  )
);

CREATE POLICY "Users can insert their campaign targets" 
ON public.campaign_targets 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.campaigns 
    WHERE campaigns.id = campaign_targets.campaign_id 
    AND campaigns.created_by = auth.uid()
  )
);

CREATE POLICY "Users can update their campaign targets" 
ON public.campaign_targets 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns 
    WHERE campaigns.id = campaign_targets.campaign_id 
    AND campaigns.created_by = auth.uid()
  )
);

CREATE POLICY "Users can delete their campaign targets" 
ON public.campaign_targets 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns 
    WHERE campaigns.id = campaign_targets.campaign_id 
    AND campaigns.created_by = auth.uid()
  )
);