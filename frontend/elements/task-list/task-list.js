Polymer({
    /** @type {boolean} Is loading content by default, display spinner */
    isLoadingContent: true,

    /** @type {Task[]} List of tasks. */
    tasks: [],

    /**
     * Creates a new task.
     */
    createNewTask: function() {
        console.log("TASKS: ", this.tasks);
    }
});