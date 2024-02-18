import * as mongodb from "mongodb";

export interface NewUser{

    firstname: string;
    lastname: string;
    role: string;
    email: string;
    passwordHash: string;
    assignedlocations: string[];
    assignedzones: string[];
    clientid?: string;
    _id: string;

}