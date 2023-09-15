export interface GoogleTokenModel {
    access_token: string;
    refresh_token: string;
    id_token?: string;
    expiry_date?: number;
}