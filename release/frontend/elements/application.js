"use strict";

var _this = undefined;
Polymer("yhbt-app", {
    isAuthenticated: false,
    updateAuthenticationStatus: function updateAuthenticationStatus(event) {
        console.log("Setting authentication status to true..");
        _this.isAuthenticated = true;
    }
});