

export interface Client{

    clientname: string;
    location: Location[];
    userRefs: string[];
    _id: string;

}
export interface Location{

    locationname: string;
    assignedusers: string[];
    zone: Zone[];
    _id: string;

    
}

export interface Zone{

    zonename: string;
    steps: string[];
    qrcode: string;
    lastcheckin: string;
    lastcheckout: string;
    timespent: string;
    lastuser: string;
    assignedusers: string[];
    _id: string;

}