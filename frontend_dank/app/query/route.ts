import { db } from "@vercel/postgres";

const client = await db.connect();

async function listInvoices() {
	const data = await client.sql`
    SELECT items.category, items.name, items.review
    FROM items
  `;

	return data.rows;
}

export async function GET() {
  try {
  	return Response.json(await listInvoices());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
