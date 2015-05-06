Polymer("yhbt-task", {
    task: {
        description: "",
        title: "",
        events: [],
        done: false
    },

    isTaskStarted: function() {
        return
    },

    /**
     * Starts the current task
     */
    start: function() {
        var currentDate = Date.now();
        this.task.events.push({
            start: currentDate
        });
    },

    /**
     * Pauses the current task
     */
    pause: function() {
        this.task.events[this.events.length - 1].end = Date.now();
    },

    /**
     * Finishes the current task and marks it as done.
     */
    finish: function() {
        this.task.events[this.events.length - 1].end = Date.now();
        this.task.done = true;
    }
});