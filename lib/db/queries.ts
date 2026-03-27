import { db } from "./client";
import { UserSession } from "@/types";
import { randomUUID } from "crypto";

export async function getUser(phone: string): Promise<UserSession | null> {
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE phone = ?",
    args: [phone],
  });
  if (!result.rows[0]) return null;
  return result.rows[0] as unknown as UserSession;
}

export async function upsertUser(session: Partial<UserSession> & { phone: string }): Promise<void> {
  const existing = await getUser(session.phone);
  if (!existing) {
    await db.execute({
      sql: `INSERT INTO users (id, phone, language, step) VALUES (?, ?, ?, ?)`,
      args: [randomUUID(), session.phone, session.language ?? "fr", session.step ?? "choose_language"],
    });
    return;
  }

  const fields = Object.entries(session)
    .filter(([k]) => k !== "phone")
    .map(([k]) => `${k} = ?`);
  const values = Object.entries(session)
    .filter(([k]) => k !== "phone")
    .map(([, v]) => v ?? null);

  if (!fields.length) return;

  await db.execute({
    sql: `UPDATE users SET ${fields.join(", ")} WHERE phone = ?`,
    args: [...values, session.phone],
  });
}

export async function createOrder(order: {
  user_id: string;
  product_id: string;
  decoder_number: string;
  payment_method: string;
}): Promise<string> {
  const id = randomUUID();
  await db.execute({
    sql: `INSERT INTO orders (id, user_id, product_id, decoder_number, payment_method) VALUES (?, ?, ?, ?, ?)`,
    args: [id, order.user_id, order.product_id, order.decoder_number, order.payment_method],
  });
  return id;
}

export async function getProducts(serviceId: string, regionId: string) {
  const result = await db.execute({
    sql: "SELECT * FROM products WHERE service_id = ? AND region_id = ?",
    args: [serviceId, regionId],
  });
  return result.rows;
}

export async function getOrderById(id: string) {
  const result = await db.execute({
    sql: "SELECT * FROM orders WHERE id = ?",
    args: [id],
  });
  return result.rows[0] ?? null;
}

export async function updateOrderStatus(id: string, status: "pending" | "paid" | "failed") {
  await db.execute({
    sql: "UPDATE orders SET status = ? WHERE id = ?",
    args: [status, id],
  });
}

export async function isMessageProcessed(messageId: string): Promise<boolean> {
  const result = await db.execute({
    sql: "SELECT message_id FROM processed_messages WHERE message_id = ?",
    args: [messageId],
  });
  return result.rows.length > 0;
}

export async function markMessageProcessed(messageId: string): Promise<void> {
  await db.execute({
    sql: "INSERT OR IGNORE INTO processed_messages (message_id) VALUES (?)",
    args: [messageId],
  });
}
