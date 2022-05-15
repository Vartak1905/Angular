import { ClientDetails } from './clientDetails';

export class Client {
    id: number
    companyName: string;
    legalEntity: number;
    businessEntityType: string;
    insuranceCategory: string;
    industryType: string;
    currentState: string;
    isAccountActivated: Boolean;
    clientDetails: ClientDetails;
    registrationStatus: string;
    inactivationReason: number;
    remarks: string;
}
