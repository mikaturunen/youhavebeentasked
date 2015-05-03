var _this = this;
Polymer("yhbt-auth", {
    isAuthenticated: false,
    onLoginStatusError: function (event) {
        console.log("User is not logged in.");
        _this.isAuthenticated = false;
    },
    onLoginStatusSuccess: function (event) {
        console.log("User is logged in.");
        _this.isAuthenticated = true;
        _this.fire("authenticated", _this.isAuthenticated);
    }
});
