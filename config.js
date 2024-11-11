import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

export const token = process.env.TELEGRAM_TOKEN;
export const baseUrl = process.env.BASE_URL;