"use strict";

var _this = undefined;
Polymer("yhbt-task-list", {
    isLoadingContent: true,
    tasks: [],
    addTask: function addTask(event) {
        var task = JSON.parse(event.detail.xhr.response);
        console.log(task);
        _this.tasks.push(task);
    },
    createNewTask: function createNewTask() {
        console.log("Creating a new task.");
        _this.$.createTask.body = { foo: "bar" };
        _this.$.createTask.go();
    }
});