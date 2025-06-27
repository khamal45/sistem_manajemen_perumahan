import { Resident_Model } from './resident_model';

export interface HouseResidentModel {
    id: number;
    nama_keluarga: string;
    tanggal_masuk: string;
    tanggal_keluar: string | null;
    residents?: Resident_Model[];
}
