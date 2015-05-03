"use strict";

var _this = undefined;
Polymer("yhbt-auth", {
    isAuthenticated: false,
    onLoginStatusError: function onLoginStatusError(event) {
        console.log("User is not logged in.");
        _this.isAuthenticated = false;
    },
    onLoginStatusSuccess: function onLoginStatusSuccess(event) {
        console.log("User is logged in.");
        _this.isAuthenticated = true;
        _this.fire("authenticated", _this.isAuthenticated);
    }
});