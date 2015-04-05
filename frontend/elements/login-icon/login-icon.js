
Polymer("login-icon", {
    /**
     * Default icon for login-icon is account-box, can be changed through attribute 'icon='
     * @type {String}
     */
    icon: "account-box",

    /**
     * Tries to login the user by reading the login credentials from the dialog inputs.
     * Called when the user clicks "ok" on the Login dialog.
     */
    tryLoggingIn: function() {
        console.log("Attempting to login the user.");
        // Setting the user information in the POST data
        // NOTE are you kidding me I have to manually stringify it for consumption with node? -argh-.
        var stringifiedLoginDetails = JSON.stringify({ 
            user: { 
                username: this.$.Username.value, 
                password: this.$.Password.value 
            }
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
        this.$.Login.close();
        this.$.Password.value = this.$.Username.value = "";
    }
});