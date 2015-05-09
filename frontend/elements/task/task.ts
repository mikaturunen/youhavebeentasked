"use strict";

interface YhbtTask {
    task: Task;
    preview: boolean;
    start: () => void;
    pause: () => void;
    finish: () => void;
    showTaskDetails: () => void;
}

Polymer("yhbt-task", <YhbtTask> {
    task: undefined,

    preview: true,

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
    },

    /**
     * Shows the complete details for a selected task.
     */
    showTaskDetails: function() {
        // TODO should we at this point refetch the task details?
        this.preview = false;
        console.log("Preview:", this.preview);
    }
});
