
// TODO add comments

interface Task {
    _id?: string;
    teamId?: string;
    userId: string;
    title: string;
    description: string;

    startLocation?: any;
    endLocation?: any;

    plannedEvents: number[];
    actualEvents: number[];

    done: boolean;

    inventoryIds: string[];
}

interface Team {
    _id?: string;
    name: string;
    memberIds: string[];
    organizerIds: string[];
}

interface User {
    _id?: string;
    username: string;
    passwordHash: string;
}
