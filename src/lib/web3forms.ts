/**
 * Client-side email delivery via Web3Forms — no backend, no page reload.
 *
 * The access key is safe to ship publicly: it only permits sending form
 * submissions to the inbox registered at web3forms.com, where spam
 * protection and delivery are handled. Replace ACCESS_KEY if you ever
 * rotate keys in the Web3Forms dashboard.
 */

const ACCESS_KEY = "e78196d9-1266-495d-8a96-1e769fb048df";
const ENDPOINT = "https://api.web3forms.com/submit";

export async function sendViaWeb3Forms(fields: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: fields.subject || "New message from your portfolio",
        from_name: fields.name,
        replyto: fields.email,
        ...fields,
      }),
    });
    const data = (await res.json().catch(() => null)) as
      | { success?: boolean }
      | null;
    return res.ok && data?.success === true;
  } catch {
    return false;
  }
}
