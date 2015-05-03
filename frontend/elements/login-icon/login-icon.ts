
Polymer("login-icon", {
    /**
     * Default icon for login-icon is account-box, can be changed through attribute 'icon='
     * @type {string}
     */
    loginIcon: "account-box",
    logoutIcon: "settings-power",

    /**
     * Tries to login the user by reading the login credentials from the dialog inputs.
     * Called when the user clicks "ok" on the Login dialog.
     */
    tryLoggingIn: () => {
        console.log("Attempting to login the user.");
        // Setting the user information in the POST data
        // NOTE are you kidding me I have to manually stringify it for consumption with node? -argh-.
        var stringifiedLoginDetails = JSON.stringify({
            username: this.$.Username.value,
            password: this.$.Password.value
        });

        this.$.TryLoggingIn.body = stringifiedLoginDetails;
        // Attempting to login with the content
        this.$.TryLoggingIn.go();
    },

    /**
     * Tries to log out the user, redirects on success.
     * Called when the user clicks "ok" on the log out dialog.
     */
    tryLogOut: () => {
        console.log("Attempting to log out the user.");
        window.location.href = "/api/logout";
    },

    /** Opens Login dialog */
    openLoginDialog: () => {
        this.$.Username.focus();
        this.$.Login.open();
    },

    /** Closes Login dialog */
    closeLoginDialog: () => {
        this.$.Login.close();
    },

    /** Opens LogOut dialog */
    openLogOutDialog: () => {
        this.$.LogOut.open();
    },

    /** Closes LogOut dialog */
    closeLogOutDialog: () => {
        this.$.LogOut.close();
    },

    /** Called on error when the user attempts to login */
    onLoginError: (event: any) => {
        console.log("Error logging in the user.", event.detail.xhr.response);
    },

    /** Called on success when the user attempts to login */
    onLoginSuccess: (event: any) =>  {
        console.log("Success logging in the user.");
        var loginDetails = JSON.parse(event.detail.xhr.response);
        console.log(loginDetails);
        this.fire("authenticated", true);

        // Reset values, close dialog
        this.$.Password.value = this.$.Username.value = "";
        this.$.Login.close();
    }
});
