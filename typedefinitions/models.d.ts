
/**
 * ModelTask interface to describe the object
 */
export interface ModelTask {
    _id: string;
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
