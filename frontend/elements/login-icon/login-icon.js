
Polymer("login-icon", {
    /**
     * Default icon for login-icon is account-box, can be changed through attribute 'icon='
     * @type {string}
     */
    icon: "account-box",

    /**
     * Default status for authentication - we are not authenticated by default - has to be confirmed by the server
     * @type {boolean}
     */
    authenticated: false,

    /**
     * Tries to login the user by reading the login credentials from the dialog inputs.
     * Called when the user clicks "ok" on the Login dialog.
     */
    tryLoggingIn: function() {
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
    
    /** Opens Login dialog */
    openLoginDialog: function() {
        this.$.Login.open();
        this.$.Username.focus();
    },
    
    /** Closes Login dialog */
    closeLoginDialog: function() {
        this.$.Login.close();
    },

    /** Called on error from the login status check */
    onLoginStatusError: function(event) {
        this.authenticated = false;
    },

    /** Called on success from the login status check */
    onLoginStatusSuccess: function(event) {
        console.log("Success checking login status of the user.");
        var loginDetails = JSON.parse(event.detail.xhr.response);
        console.log("Login status:", loginDetails);
        this.authenticated = loginDetails;
    },

    /** Called on error when the user attempts to login */
    onLoginError: function(event) {
        console.log("Error logging in the user.", event.detail.xhr.response);
    },

    /** Called on success when the user attempts to login */
    onLoginSuccess: function(event) {
        console.log("Success logging in the user.");
        var loginDetails = JSON.parse(event.detail.xhr.response);
        console.log(loginDetails);

        // Reset values, close dialog
        this.$.Password.value = this.$.Username.value = "";
        this.$.Login.close();
    }
});