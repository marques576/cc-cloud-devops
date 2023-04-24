import mysql from 'mysql2/promise';

export async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_URL || 'localhost',
      user: process.env.DATABASE_USER ||'dboids',
      password: process.env.DATABASE_PASSWORD || 'dboids',
      database: process.env.DATABASE_NAME || 'dboids_db',
      port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
    });
    console.log('Connected to MySQL server');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL server', error);
    throw error;
  }
}