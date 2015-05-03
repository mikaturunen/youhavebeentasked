var _this = this;
Polymer("login-icon", {
    loginIcon: "account-box",
    logoutIcon: "settings-power",
    tryLoggingIn: function () {
        console.log("Attempting to login the user.");
        var stringifiedLoginDetails = JSON.stringify({
            username: _this.$.Username.value,
            password: _this.$.Password.value
        });
        _this.$.TryLoggingIn.body = stringifiedLoginDetails;
        _this.$.TryLoggingIn.go();
    },
    tryLogOut: function () {
        console.log("Attempting to log out the user.");
        window.location.href = "/api/logout";
    },
    openLoginDialog: function () {
        _this.$.Username.focus();
        _this.$.Login.open();
    },
    closeLoginDialog: function () {
        _this.$.Login.close();
    },
    openLogOutDialog: function () {
        _this.$.LogOut.open();
    },
    closeLogOutDialog: function () {
        _this.$.LogOut.close();
    },
    onLoginError: function (event) {
        console.log("Error logging in the user.", event.detail.xhr.response);
    },
    onLoginSuccess: function (event) {
        console.log("Success logging in the user.");
        var loginDetails = JSON.parse(event.detail.xhr.response);
        console.log(loginDetails);
        _this.fire("authenticated", true);
        _this.$.Password.value = _this.$.Username.value = "";
        _this.$.Login.close();
    }
});
