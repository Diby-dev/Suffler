import postgres from 'postgres';

// Assurez-vous que votre variable DATABASE_URL est bien dans .env.local
const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { ssl: 'require' });

export default sql;