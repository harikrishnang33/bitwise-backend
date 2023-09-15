export interface DbConfig {
  type: string;
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  logging: boolean;
}
