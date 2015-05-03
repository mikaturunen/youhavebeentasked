
/// <reference path="./express/express.d.ts"/>

/**
 * Interface that extends the Request object to contain the specified User object.
 */
interface UserRequest extends Express.Request {
    // TODO update User to proper type once it's defined
    user: {
        _id: string;
        username: string;
        password: string;
    }
}