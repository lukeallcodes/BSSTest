import { Zone } from "./zone";

export interface Location{

    locationname: string;
    assignedusers: string[];
    zone: Zone[];
    _id: string;

}