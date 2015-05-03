var _this = this;
Polymer("yhbt-app", {
    isAuthenticated: false,
    updateAuthenticationStatus: function (event) {
        console.log("Setting authentication status to true..");
        _this.isAuthenticated = true;
    }
});
