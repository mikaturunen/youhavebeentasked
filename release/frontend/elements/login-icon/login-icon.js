"use strict";

var _this = undefined;
Polymer("login-icon", {
    loginIcon: "account-box",
    logoutIcon: "settings-power",
    tryLoggingIn: function tryLoggingIn() {
        console.log("Attempting to login the user.");
        var stringifiedLoginDetails = JSON.stringify({
            username: _this.$.Username.value,
            password: _this.$.Password.value
        });
        _this.$.TryLoggingIn.body = stringifiedLoginDetails;
        _this.$.TryLoggingIn.go();
    },
    tryLogOut: function tryLogOut() {
        console.log("Attempting to log out the user.");
        window.location.href = "/api/logout";
    },
    openLoginDialog: function openLoginDialog() {
        _this.$.Username.focus();
        _this.$.Login.open();
    },
    closeLoginDialog: function closeLoginDialog() {
        _this.$.Login.close();
    },
    openLogOutDialog: function openLogOutDialog() {
        _this.$.LogOut.open();
    },
    closeLogOutDialog: function closeLogOutDialog() {
        _this.$.LogOut.close();
    },
    onLoginError: function onLoginError(event) {
        console.log("Error logging in the user.", event.detail.xhr.response);
    },
    onLoginSuccess: function onLoginSuccess(event) {
        console.log("Success logging in the user.");
        var loginDetails = JSON.parse(event.detail.xhr.response);
        console.log(loginDetails);
        _this.fire("authenticated", true);
        _this.$.Password.value = _this.$.Username.value = "";
        _this.$.Login.close();
    }
});