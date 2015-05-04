Polymer("yhbt-app", {

    isAuthenticated: false,

    updateAuthenticationStatus: function(event: any) {
        console.log("Setting authentication status to true..");
        this.isAuthenticated = true;
    }
});
