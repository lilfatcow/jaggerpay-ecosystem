import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getMoniteToken() {
  const clientId = Deno.env.get('MONITE_CLIENT_ID');
  const clientSecret = Deno.env.get('MONITE_CLIENT_SECRET');
  const apiUrl = Deno.env.get('MONITE_API_URL');

  console.log('Getting Monite token...');

  try {
    const response = await fetch(`${apiUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully obtained Monite token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting Monite token:', error);
    throw error;
  }
}

async function handleMoniteRequest(req: Request) {
  try {
    const { path, method, body } = await req.json();
    const token = await getMoniteToken();
    const apiUrl = Deno.env.get('MONITE_API_URL');
    const entityId = Deno.env.get('MONITE_ENTITY_ID');

    console.log(`Making Monite API request to ${path}`);

    const response = await fetch(`${apiUrl}${path}`, {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-monite-entity-id': entityId!,
        'x-monite-version': Deno.env.get('MONITE_VERSION')!,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in Monite request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleMoniteRequest(req);
});