import { HouseResidentModel } from './house_resident_model';

export interface UnpaidFeeModel {
    fee_type: string;
    periode_bulan: string;
    nominal: number;
    fee_type_id: number;
}

export interface FuturePaymentModel {
    fee_type_id: number;
    fee_type_name: string;
    bulan_awal: string; // "YYYY-MM"
    bulan_akhir: string; // "YYYY-MM"
    nominal: number;
}

export interface TagihanModel {
    house_resident: HouseResidentModel;
    unpaid_fees: UnpaidFeeModel[];
    future_payment_options: FuturePaymentModel[];
}
