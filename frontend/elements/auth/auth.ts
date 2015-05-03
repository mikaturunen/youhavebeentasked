
Polymer("yhbt-auth", {
    /** @type {boolean} Has the user authenticated, allowing further communication from front to back. */
    isAuthenticated: false,

    /** Called on error from the login status check */
    onLoginStatusError: (event: any) => {
        console.log("User is not logged in.");
        this.isAuthenticated = false;
    },

    /** Called on success from the login status check */
    onLoginStatusSuccess: (event: any) => {
        console.log("User is logged in.");
        this.isAuthenticated = true;
        this.fire("authenticated", this.isAuthenticated);
    }
});
