import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  content: string;
  campaignId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, content, campaignId }: EmailRequest = await req.json();

    console.log(`Sending campaign email to ${to} for campaign ${campaignId}`);

    // Create encrypted training link (using base64 encoding for simplicity)
    const trainingData = btoa(JSON.stringify({ campaignId, email: to }));
    const trainingLink = `${Deno.env.get('SUPABASE_URL')}/training?token=${trainingData}`;

    const emailResponse = await resend.emails.send({
      from: "Security Training <hkulshrestha6@gmail.com>",
      to: [to],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .content { white-space: pre-wrap; }
              .training-link { 
                display: inline-block; 
                margin: 20px 0; 
                padding: 12px 24px; 
                background-color: #0066cc; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px;
              }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="content">${content.replace(/\n/g, '<br>')}</div>
              <div style="margin: 30px 0; text-align: center;">
                <a href="${trainingLink}" class="training-link">Complete Security Training</a>
                <p style="font-size: 14px; color: #666; margin-top: 10px;">
                  Click the button above to complete your mandatory security awareness training.
                </p>
              </div>
              <div class="footer">
                <p>This is a phishing simulation email sent as part of your organization's security awareness training program.</p>
                <p style="margin-top: 10px;">Training Link: <a href="${trainingLink}">${trainingLink}</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending campaign email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
