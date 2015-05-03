Polymer("yhbt-task", {
    task: {
        description: "",
        title: "",
        events: [],
        done: false
    },

    isTaskStarted: () => {
        return
    },

    /**
     * Starts the current task
     */
    start: () => {
        var currentDate = Date.now();
        this.task.events.push({
            start: currentDate
        });
    },

    /**
     * Pauses the current task
     */
    pause: () => {
        this.task.events[this.events.length - 1].end = Date.now();
    },

    /**
     * Finishes the current task and marks it as done.
     */
    finish: () => {
        this.task.events[this.events.length - 1].end = Date.now();
        this.task.done = true;
    }
});
