import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Pulse",
    password: "Pr@bhat007",
    port: 5432
});

export default pool;