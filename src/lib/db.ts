import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const SCHEMA = `
create table if not exists family (
  id text primary key,
  name text not null,
  currency text not null default 'TWD',
  created_at integer not null
);
create table if not exists member (
  id text primary key,
  family_id text not null references family(id),
  user_id text not null,
  role text not null check (role in ('admin','caretaker')),
  name text not null,
  active integer not null default 1,
  created_at integer not null
);
create index if not exists member_user on member(user_id);
create index if not exists member_family on member(family_id);
create table if not exists invite (
  code text primary key,
  family_id text not null references family(id),
  role text not null,
  created_by text not null,
  created_at integer not null,
  expires_at integer not null
);
create table if not exists cash (
  id text primary key,
  family_id text not null references family(id),
  caretaker_id text not null references member(id),
  amount integer not null,
  note text,
  given_by text not null references member(id),
  created_at integer not null,
  ack_at integer
);
create index if not exists cash_caretaker on cash(caretaker_id);
create table if not exists expense (
  id text primary key,
  family_id text not null references family(id),
  member_id text not null references member(id),
  amount integer not null,
  category text not null default 'food',
  note text,
  photo text,
  spent_at integer not null,
  created_at integer not null
);
create index if not exists expense_member on expense(member_id);
create table if not exists record (
  id text primary key,
  family_id text not null references family(id),
  caretaker_id text references member(id),
  kind text not null check (kind in ('salary','health','other')),
  amount integer not null,
  note text,
  photo text,
  date text not null,
  shared integer not null default 0,
  created_by text not null references member(id),
  created_at integer not null
);
create index if not exists record_family on record(family_id);
`;

function addColumn(d: Database.Database, table: string, col: string, def: string) {
  const cols = d.prepare(`pragma table_info(${table})`).all() as { name: string }[];
  if (!cols.some((c) => c.name === col)) d.exec(`alter table ${table} add column ${col} ${def}`);
}

function open() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const d = new Database(path.join(DATA_DIR, "app.db"));
  d.pragma("journal_mode = WAL");
  d.pragma("busy_timeout = 5000");
  d.pragma("foreign_keys = ON");
  d.exec(SCHEMA);
  addColumn(d, "family", "demo", "integer not null default 0");
  // Who typed the cash row in: a master (caretaker must ack) or the caretaker herself (a master confirms).
  addColumn(d, "cash", "created_by", "text");
  addColumn(d, "cash", "confirmed_at", "integer");
  return d;
}

const g = globalThis as unknown as { __db?: Database.Database };
export const db: Database.Database = (g.__db ??= open());

export const newId = () => crypto.randomUUID();
