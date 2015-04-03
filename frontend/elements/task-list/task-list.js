
Polymer({
    /** @type {boolean} Is loading content by default, display spinner */
    isLoadingContent: true,

    /** @type {Task[]} List of tasks. */
    tasks: [],

    taskToAdd: {},

    addTask: function(event) {
        var task = JSON.parse(event.detail.xhr.response);
        console.log(task);
        this.tasks.push(task);
    },

    /**
     * Creates a new task.
     */
    createNewTask: function() {
        console.log("Creating a new task.");
        this.$.createTask.body = { foo: "bar" };
        this.$.createTask.go();
    }
});
