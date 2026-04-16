import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const body = await req.text();

  // Create a new Webhook instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured during verification', {
      status: 400,
    });
  }

  const eventType = evt.type;

  // Handle the user.created event
  if (eventType === 'user.created') {
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : '';
    // Combine first and last name, handling potential nulls
    const username = `${first_name || ''} ${last_name || ''}`.trim();

    const backendPayload = {
      clerkId,
      email,
      username,
      image: image_url || '',
    };

    try {
      console.log('Forwarding to backend:', backendPayload);
      const backendResponse = await fetch('http://localhost:8080/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendPayload),
      });

      if (!backendResponse.ok) {
        console.error('Failed to forward to backend. Status:', backendResponse.status);
      } else {
        console.log('Successfully forwarded to backend');
      }
    } catch (error) {
      console.error('Error forwarding to backend:', error);
    }
  }

  return new Response('Webhook received', { status: 200 });
}
