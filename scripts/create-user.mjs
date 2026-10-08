import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL);
const [, , email, password, name] = process.argv;

if (!email || !password || !name) {
  console.log('Uso: node --env-file=.env.local scripts/create-user.mjs correo clave "Nombre"');
  process.exit(1);
}

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id            SERIAL       PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL
  );
`;

const hash = await bcrypt.hash(password, 10);

await sql`
  INSERT INTO users (name, email, password_hash)
  VALUES (${name}, ${email}, ${hash})
  ON CONFLICT (email) DO UPDATE SET password_hash = ${hash}, name = ${name}
`;

console.log('Usuario creado:', email);