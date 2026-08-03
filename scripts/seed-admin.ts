// D1 sólo es alcanzable como binding dentro de un Worker en runtime — este
// script corre como Node plano (tsx), así que no puede usar Drizzle contra
// D1 directamente. En cambio, calcula el hash acá y lo inserta vía
// `wrangler d1 execute`, que sí puede hablarle a D1 (local o remota) desde
// fuera de un Worker.
import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

const DB_NAME = "diplomatic-automobile-trading-db";

function sqlEscape(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const remote = process.argv.includes("--remote");

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en el entorno para sembrar el usuario admin.",
    );
  }

  // Cost factor 10, igual que src/lib/auth.ts (hashPassword) — validado sin
  // problema de CPU en runtime real de Workers (~330ms por login).
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = randomUUID();

  const sql = `
    INSERT INTO "User" (id, email, hashedPassword, name, createdAt, updatedAt)
    VALUES (${sqlEscape(id)}, ${sqlEscape(email)}, ${sqlEscape(hashedPassword)}, 'Admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(email) DO UPDATE SET hashedPassword = excluded.hashedPassword, updatedAt = CURRENT_TIMESTAMP;
  `.trim();

  // --file evita el infierno de escaping de shell en Windows que --command
  // tiene con SQL multilínea (--command rompía el INSERT en "argumentos"
  // sueltos en PowerShell/cmd).
  const tmpFile = join(os.tmpdir(), `seed-admin-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql, "utf-8");

  try {
    execFileSync(
      "npx",
      [
        "wrangler",
        "d1",
        "execute",
        DB_NAME,
        remote ? "--remote" : "--local",
        `--file=${tmpFile}`,
      ],
      { stdio: "inherit", shell: true },
    );
  } finally {
    unlinkSync(tmpFile);
  }

  console.log(`Usuario admin listo: ${email}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
