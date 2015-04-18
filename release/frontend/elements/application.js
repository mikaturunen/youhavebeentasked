Polymer("yhbt-app", {

    isAuthenticated: false,

    updateAuthenticationStatus: function(event) {
        console.log("Setting authentication status to true..");
        this.isAuthenticated = true;
    }
});