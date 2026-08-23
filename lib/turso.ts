/**
 * Server-side Turso HTTP client (v2 pipeline API).
 * Uses native fetch — no extra dependencies needed.
 * Only runs on the server (API routes, Server Components).
 */

const DB_URL   = process.env.TURSO_DB_URL!;
const DB_TOKEN = process.env.TURSO_AUTH_TOKEN!;

// ─── Types ────────────────────────────────────────────────────────────────────

type TursoArg =
  | { type: "text";  value: string }
  | { type: "float"; value: number }
  | { type: "null" };

interface TursoStatement {
  sql:  string;
  args: TursoArg[];
}

interface TursoCell {
  type:  string;
  value: string | number | null;
}

interface TursoResult {
  cols: { name: string }[];
  rows: TursoCell[][];
}

// ─── Arg helpers ──────────────────────────────────────────────────────────────

export const txt  = (v: string | number): TursoArg => ({ type: "text",  value: String(v) });
export const num  = (v: number):          TursoArg => ({ type: "float", value: Number(v) });
export const nul  = ():                   TursoArg => ({ type: "null" });

// ─── Core execute ─────────────────────────────────────────────────────────────

export async function tursoExecute(statements: TursoStatement[]): Promise<TursoResult[]> {
  if (!DB_URL || !DB_TOKEN) {
    throw new Error("TURSO_DB_URL or TURSO_AUTH_TOKEN is not set");
  }

  const requests = [
    ...statements.map((stmt) => ({ type: "execute", stmt })),
    { type: "close" },
  ];

  const res = await fetch(`${DB_URL}/v2/pipeline`, {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${DB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requests }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Turso HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();

  // Surface statement-level errors
  for (const r of data.results ?? []) {
    if (r.type === "error") {
      throw new Error(`Turso statement error: ${r.error?.message ?? JSON.stringify(r.error)}`);
    }
  }

  return (data.results as { response?: { result?: TursoResult } }[])
    .filter((r) => r.response?.result)
    .map((r)  => r.response!.result!);
}

// ─── Row mapper ───────────────────────────────────────────────────────────────

export function mapRows<T = Record<string, unknown>>(result: TursoResult): T[] {
  const cols = result.cols.map((c) => c.name);
  return result.rows.map((row) => {
    const obj: Record<string, unknown> = {};
    cols.forEach((col, i) => {
      const cell = row[i];
      obj[col] = cell?.type === "null" ? null : (cell?.value ?? null);
    });
    return obj as T;
  });
}

// ─── Convenience: single-statement query ──────────────────────────────────────

export async function tursoQuery<T = Record<string, unknown>>(
  sql:  string,
  args: TursoArg[] = []
): Promise<T[]> {
  const results = await tursoExecute([{ sql, args }]);
  return results[0] ? mapRows<T>(results[0]) : [];
}

// ─── DB helpers used by admin routes ─────────────────────────────────────────

export interface Order {
  id:                    string;
  subscriber_id:         string;
  service_id:            string;
  service_name:          string;
  service_provider:      string;
  country_id:            string | null;
  amount_usd:            number;
  payer_phone:           string;
  recipient_detail:      string | null;
  status:                string;
  created_at:            string;
  transaction_reference: string | null;
}

export interface Subscriber {
  id:         string;
  name:       string;
  phone:      string;
  created_at: string;
}

export interface Stats {
  total_orders:     number;
  completed_orders: number;
  failed_orders:    number;
  pending_orders:   number;
  total_revenue:    number;
  total_subscribers: number;
  today_orders:     number;
  today_revenue:    number;
}

export async function fetchStats(): Promise<Stats> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [general, todayStats, subscribers] = await tursoExecute([
    {
      sql: `SELECT
              COUNT(*)                                      AS total_orders,
              SUM(CASE WHEN status='COMPLETED' THEN 1 ELSE 0 END) AS completed_orders,
              SUM(CASE WHEN status='FAILED'    THEN 1 ELSE 0 END) AS failed_orders,
              SUM(CASE WHEN status='PENDING'   THEN 1 ELSE 0 END) AS pending_orders,
              COALESCE(SUM(CASE WHEN status='COMPLETED' THEN amount_usd ELSE 0 END), 0) AS total_revenue
            FROM orders`,
      args: [],
    },
    {
      sql: `SELECT
              COUNT(*) AS today_orders,
              COALESCE(SUM(CASE WHEN status='COMPLETED' THEN amount_usd ELSE 0 END), 0) AS today_revenue
            FROM orders
            WHERE created_at LIKE ?`,
      args: [txt(`${today}%`)],
    },
    {
      sql:  `SELECT COUNT(*) AS total_subscribers FROM subscribers`,
      args: [],
    },
  ]);

  const g = mapRows<Record<string, number>>(general)[0]  ?? {};
  const td = mapRows<Record<string, number>>(todayStats)[0] ?? {};
  const s  = mapRows<Record<string, number>>(subscribers)[0] ?? {};

  return {
    total_orders:      Number(g.total_orders      ?? 0),
    completed_orders:  Number(g.completed_orders  ?? 0),
    failed_orders:     Number(g.failed_orders     ?? 0),
    pending_orders:    Number(g.pending_orders    ?? 0),
    total_revenue:     Number(g.total_revenue     ?? 0),
    today_orders:      Number(td.today_orders     ?? 0),
    today_revenue:     Number(td.today_revenue    ?? 0),
    total_subscribers: Number(s.total_subscribers ?? 0),
  };
}

export async function fetchOrders(limit = 50, offset = 0, search = ""): Promise<{ orders: Order[]; total: number }> {
  if (search.trim()) {
    const like = txt(`%${search.trim()}%`);
    const [rows, count] = await tursoExecute([
      {
        sql:  `SELECT * FROM orders
               WHERE id LIKE ? OR payer_phone LIKE ? OR service_name LIKE ?
                  OR service_provider LIKE ? OR status LIKE ?
               ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        args: [like, like, like, like, like, num(limit), num(offset)],
      },
      {
        sql:  `SELECT COUNT(*) AS total FROM orders
               WHERE id LIKE ? OR payer_phone LIKE ? OR service_name LIKE ?
                  OR service_provider LIKE ? OR status LIKE ?`,
        args: [like, like, like, like, like],
      },
    ]);
    return {
      orders: mapRows<Order>(rows),
      total:  Number(mapRows<{ total: number }>(count)[0]?.total ?? 0),
    };
  }

  const [rows, count] = await tursoExecute([
    {
      sql:  `SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [num(limit), num(offset)],
    },
    {
      sql:  `SELECT COUNT(*) AS total FROM orders`,
      args: [],
    },
  ]);
  return {
    orders: mapRows<Order>(rows),
    total:  Number(mapRows<{ total: number }>(count)[0]?.total ?? 0),
  };
}

export async function fetchSubscribers(limit = 50, offset = 0): Promise<{ subscribers: Subscriber[]; total: number }> {
  const [rows, count] = await tursoExecute([
    {
      sql:  `SELECT * FROM subscribers ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [num(limit), num(offset)],
    },
    {
      sql:  `SELECT COUNT(*) AS total FROM subscribers`,
      args: [],
    },
  ]);
  return {
    subscribers: mapRows<Subscriber>(rows),
    total:       Number(mapRows<{ total: number }>(count)[0]?.total ?? 0),
  };
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await tursoExecute([{
    sql:  `UPDATE orders SET status = ? WHERE id = ?`,
    args: [txt(status), txt(id)],
  }]);
}
