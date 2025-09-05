import mysql from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export interface PostRow extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

