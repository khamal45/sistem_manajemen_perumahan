import { HouseResidentModel } from './house_resident_model';

export interface House_Model {
    id: number;
    nomor_rumah: string;
    house_residents?: HouseResidentModel[];
}

export interface House_Model_Props {
    houses: House_Model[];
}
