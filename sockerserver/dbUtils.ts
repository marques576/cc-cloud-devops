import mysql from 'mysql2/promise';

export async function connect() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: 'dboids',
      password: 'dboids',
      database: 'dboids_db'
    });
    console.log('Connected to MySQL server');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL server', error);
    throw error;
  }
}