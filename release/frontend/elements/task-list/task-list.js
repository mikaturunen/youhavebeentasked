var _this = this;
Polymer("yhbt-task-list", {
    isLoadingContent: true,
    tasks: [],
    addTask: function (event) {
        var task = JSON.parse(event.detail.xhr.response);
        console.log(task);
        _this.tasks.push(task);
    },
    createNewTask: function () {
        console.log("Creating a new task.");
        _this.$.createTask.body = { foo: "bar" };
        _this.$.createTask.go();
    }
});
