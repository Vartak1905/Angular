import { Address } from './address';

export class ClientDetails {
    id: number;
    employeeCount: string;
    panNumber: string;
    panReference: string;
    gstNumber: string;
    remarks: string;
    officeAddress: Address;
    corrAddress: Address
}
