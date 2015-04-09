# Database document descriptions
## User

    {
        _id: string; 
        username: string;
        passwordHash: string;
    }


## Team

    {
        _id: string;
        name: string;
        memberIds: string[];
        organizerIds: string[];        
    }


## Task

    {
        _id: string;
        teamId: string;
        userId: string;
        title: string;
        description: string;

        startLocation: any;
        endLocation: any;

        plannedEvents: number[];
        actualEvents: number[];

        done: boolean;

        inventoryIds: string[];
    }