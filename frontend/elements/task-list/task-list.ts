
interface YhbtTaskList {
    isLoadingContent: boolean;
    tasks: Task[];
    addTask: (event: any) => void;
    createNewTask: () => void;
}

Polymer("yhbt-task-list", <YhbtTaskList> {
    /** @type {boolean} Is loading content by default, display spinner */
    isLoadingContent: true,

    /** @type {Task[]} List of tasks. */
    tasks: [],

    /**
     * Adds a task into the Task list.
     * @param {Object} event Event object from the core-ajax event.
     */
    addTask: function(event: any) {
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
