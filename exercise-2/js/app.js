(function () {
    var taskInput = document.getElementById("new-task");
    var addButton = document.getElementById("btnAdd");
    var incompleteTasksHolder = document.getElementById("incomplete-tasks");
    var completedTasksHolder = document.getElementById("completed-tasks");
    var validationErrorLabel = document.getElementById("validationError");
    var previousEditValue = "";
    var createNewTaskElement = function (taskString, arr) {
        listItem = document.createElement("li");
        checkBox = document.createElement("input");
        label = document.createElement("label");
        editInput = document.createElement("input");
        editButton = document.createElement("button");
        deleteButton = document.createElement("button");

        checkBox.type = "checkbox";
        editInput.type = "text";
        editButton.innerText = "Edit";
        editButton.className = "edit";
        deleteButton.innerText = "Delete";
        deleteButton.className = "delete";
        label.innerText = taskString;

        listItem.appendChild(checkBox);
        listItem.appendChild(label);
        listItem.appendChild(editInput);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        return listItem;
    };

    var addTask = function () {
        var listItemName = taskInput.value
        validationErrorLabel.innerText = "";
        if (listItemName.length != 0) {
            listItem = createNewTaskElement(listItemName)
            incompleteTasksHolder.appendChild(listItem)
            bindTaskEvents(listItem, taskCompleted)
            taskInput.value = "";
            addStorage(listItemName, "incomplete-tasks")
        }
        else {
            validationErrorLabel.innerText = "New Task - cannot be empty"
        }

    };

    var editTask = function () {
        var listItem = this.parentNode;
        var editInput = listItem.querySelectorAll("input[type=text")[0];
        var label = listItem.querySelector("label");
        var button = listItem.getElementsByTagName("button")[0];

        var containsClass = listItem.classList.contains("editMode");
        if (containsClass) {
            label.innerText = editInput.value
            button.innerText = "Edit";
            changeStorage_editName(previousEditValue, editInput.value, listItem.parentNode.getAttribute("id"))
            previousEditValue = "";
        } else {
            editInput.value = label.innerText
            button.innerText = "Save";
            previousEditValue = label.innerText;
        }

        listItem.classList.toggle("editMode");
    };

    var deleteTask = function (el) {
        var listItem = this.parentNode;
        var ul = listItem.parentNode;
        deleteFromStorage(listItem.querySelectorAll("label")[0].innerText, ul.getAttribute("id"))
        ul.removeChild(listItem);
    };

    var taskCompleted = function (el) {
        var listItem = this.parentNode;
        listItem.querySelectorAll("input[type='checkbox']")[0].checked = true;
        changeStorage(listItem.querySelectorAll("label")[0].innerText, incompleteTasksHolder.getAttribute("id"), completedTasksHolder.getAttribute("id"))
        completedTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskIncomplete, true);

    };

    var taskIncomplete = function () {
        var listItem = this.parentNode;
        listItem.querySelectorAll("input[type='checkbox']")[0].checked = false;
        changeStorage(listItem.querySelectorAll("label")[0].innerText, completedTasksHolder.getAttribute("id"), incompleteTasksHolder.getAttribute("id"))
        incompleteTasksHolder.appendChild(listItem);
        bindTaskEvents(listItem, taskCompleted, false);
    };

    var bindTaskEvents = function (taskListItem, checkBoxEventHandler, cb) {
        var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
        var editButton = taskListItem.querySelectorAll("button.edit")[0];
        var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
        editButton.onclick = editTask;
        deleteButton.onclick = deleteTask;
        checkBox.checked =cb;
        checkBox.onchange = checkBoxEventHandler;
    };

    addButton.addEventListener("click", addTask);
    taskInput.addEventListener("keyup", function (event) {
        validationErrorLabel.innerText = "";
        if (event.keyCode == 13) {
            addTask();
        }
    })

    for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
        bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
    }

    for (var i = 0; i < completedTasksHolder.children.length; i++) {
        bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
    }

    // ct or inc
    function addStorage(itemName, storageName) {
        var taskJson = JSON.parse(localStorage.getItem(storageName));
        if (taskJson == null) {
            localStorage.setItem("incomplete-tasks", JSON.stringify([]))
            taskJson = JSON.parse(localStorage.getItem(storageName));
        }
        taskJson.push(itemName);
        localStorage.setItem(storageName, JSON.stringify(taskJson))
    }

    function changeStorage_editName(previous, newItem, storageName) {
        var taskJson = JSON.parse(localStorage.getItem(storageName));
        taskJson.pop(previous);
        taskJson.push(newItem);
        localStorage.setItem(storageName, JSON.stringify(taskJson))
    }

    function changeStorage(item, old, curr) {
        var taskJson = JSON.parse(localStorage.getItem(old));
        taskJson = deleteItemFromJson(taskJson, item);
        localStorage.setItem(old, JSON.stringify(taskJson))
        var ntaskJson = JSON.parse(localStorage.getItem(curr));
        ntaskJson.push(item)
        localStorage.setItem(curr, JSON.stringify(ntaskJson))
    }

    function deleteFromStorage(item, storageName) {
        var taskJson = JSON.parse(localStorage.getItem(storageName));
        taskJson = deleteItemFromJson(taskJson, item);
        localStorage.setItem(storageName, JSON.stringify(taskJson))
    }

    function updateView() {
        var completedTasks = JSON.parse(localStorage.getItem("completed-tasks"));
        var incompletedTasks = JSON.parse(localStorage.getItem("incomplete-tasks"));
        if (incompletedTasks == null) {
            localStorage.setItem("incomplete-tasks", JSON.stringify([]))
        }
        else {
            for (var i = 0; i < incompletedTasks.length; i++) {
                listItem = createNewTaskElement(incompletedTasks[i]);
                incompleteTasksHolder.appendChild(listItem)
                bindTaskEvents(listItem, taskCompleted,false)
            }
        }
        if (completedTasks == null) {
            localStorage.setItem("completed-tasks", JSON.stringify([]))
        }
        else {
            for (var i = 0; i < completedTasks.length; i++) {
                listItem = createNewTaskElement(completedTasks[i]);
                completedTasksHolder.appendChild(listItem);
                bindTaskEvents(listItem, taskIncomplete,true);
            }
        }
    }

    function deleteItemFromJson(json, itemToDelete) {
        for (var i = 0; i < json.length; i++) {
            if (json[i] == itemToDelete) {
                delete json[i]
            }
        }
        var newJson = [];
        for (var i = 0; i < json.length; i++) {
            if (typeof (json[i]) == "string") {
                newJson.push(json[i]);
            }
        }

        return newJson;
    }

    updateView()
})();