Polymer("yhbt-app", {

    isAuthenticated: false,

    updateAuthenticationStatus: (event: any) => {
        console.log("Setting authentication status to true..");
        this.isAuthenticated = true;
    }
});
