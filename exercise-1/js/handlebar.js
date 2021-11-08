function getUsers() {
    return (getTheUsers().then(function (data) {
        var users = {};
        users.data = JSON.parse(data);
        var template = Handlebars.compile(document.querySelector("#template").innerHTML);
        var filled = template(users);
        document.querySelector("#userList").innerHTML = filled;
    }));
}

$(document).ready(function () {
    getUsers();
});
function toggle(id) {
    if ($("#" + id).text() == "Show details") {
        $("#" + id).text("Hide Details");
        $("#" + id).parent().parent().find(".user_details").show();
    }
    else {
        $("#" + id).text("Show details");
        $("#" + id).parent().parent().find(".user_details").hide();
    }
}
