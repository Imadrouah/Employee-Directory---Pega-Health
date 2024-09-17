$.ajax({
    url: "../php/isLogged.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
        if (!data.logged_in) {
            window.location.href = "../login.html";
        } else {
            if (data.role === "admin") $(".loader").addClass("stop");
            else window.location.href = "../index.html";
        }
    },
    error: function (error) {
        console.error("Error checking login status:", error);
    },
});

$(document).ready(function () {
    let fetchedUsers = null,
        fetchedEmployees = null;
    if (localStorage.getItem("theme") == "dark") {
        $("html").addClass("dark");
    } else {
        $("html").removeClass("dark");
    }

    $(".logout-btn").on("click", function () {
        $.ajax({
            url: "../php/logout.php",
            method: "GET",
            success: function () {
                window.location.href = "../login.html";
            },
            error: function (error) {
                console.error("Error logging out:", error);
            },
        });
    });

    $(".close-update").on("click", function () {
        $("#update-form").removeClass("open");
    });

    $(".employee-update").on("click", function () {
        $("#update-employee-form").removeClass("open");
    });

    fetchUsers();
    fetchEmployees();

    $("#add-user-form").on("submit", function (event) {
        event.preventDefault();
        let username = $("#username").val().trim();
        let password = $("#password").val().trim();
        let role = $("#role").val();

        $.ajax({
            url: "../php/user/addUser.php",
            method: "POST",
            dataType: "json",
            data: { username: username, password: password, role: role },
            success: function (data) {
                showMessage(data);
                if (data.status == "success") {
                    $("#add-user-form")[0].reset();
                    fetchUsers();
                }
            },
            error: function (error) {
                console.error("Error adding user:", error);
            },
        });
    });

    $("#update-form").on("submit", function (event) {
        event.preventDefault();
        let id = $(this).data("id");
        let username = $("#update-username").val().trim();
        let password = $("#update-password").val().trim().length
            ? $("#update-password").val().trim()
            : null;
        let role = $("#update-role").val();

        let oldUsername = fetchedUsers.find((u) => u.id == id).username;
        let oldRole = fetchedUsers.find((u) => u.id == id).role;
        if (
            username !== oldUsername ||
            role !== oldRole ||
            $("#update-password").val().trim().length
        ) {
            $.ajax({
                url: "../php/user/updateUser.php",
                method: "POST",
                dataType: "json",
                data: {
                    id: id,
                    username: username,
                    password: password,
                    role: role,
                },
                success: function (data) {
                    showMessage(data);
                    if (data.status == "success") {
                        $("#update-form")[0].reset();
                        $(".close-update").click();
                        fetchUsers();
                    }
                },
                error: function (error) {
                    console.error("Error updating user:", error);
                },
            });
        } else {
            $(".close-update").click();
        }
    });

    $(document).on("click", function (e) {
        if ($(e.target).hasClass("edit-btn")) {
            let id = $(e.target).data("id");
            $("#update-form").addClass("open");
            let username = fetchedUsers.find((u) => u.id == id).username;
            let role = fetchedUsers.find((u) => u.id == id).role;
            $("#update-form").attr("data-id", id);
            $("#update-username").val(username);
            $("#update-role").val(role);
        } else if ($(e.target).hasClass("delete-btn")) {
            let id = $(e.target).data("id");

            $.ajax({
                url: "../php/user/deleteUser.php",
                method: "post",
                dataType: "json",
                data: { id: id },
                success: function (data) {
                    showMessage(data);
                    if (data.status == "success") {
                        fetchUsers();
                    }
                },
                error: function (error) {
                    console.error("Error deleting notifications:", error);
                },
            });
        }
        if ($(e.target).hasClass("edit-employee-btn")) {
            let id = $(e.target).data("id");
            $("#update-employee-form").addClass("open");
            let name = fetchedEmployees.find((e) => e.id == id).name;
            let position = fetchedEmployees.find((e) => e.id == id).position;
            let cin = fetchedEmployees.find((e) => e.id == id).cin;
            let email = fetchedEmployees.find((e) => e.id == id).email;
            let phone = fetchedEmployees.find((e) => e.id == id).phone;
            let skills = fetchedEmployees.find((e) => e.id == id).skills;
            $("#update-employee-form").attr("data-id", id);
            $("#update-employee-name").val(name);
            $("#update-employee-position").val(position);
            $("#update-employee-cin").val(cin);
            $("#update-employee-email").val(email);
            $("#update-employee-phone").val(phone);
            $("#update-employee-skills").val(skills);
        } else if ($(e.target).hasClass("delete-employee-btn")) {
            let id = $(e.target).data("id");

            $.ajax({
                url: "../php/employee/deleteEmployee.php",
                method: "post",
                dataType: "json",
                data: { id: id },
                success: function (data) {
                    showMessage(data);
                    if (data.status == "success") {
                        fetchEmployees();
                    }
                },
                error: function (error) {
                    console.error("Error deleting employee:", error);
                },
            });
        }
    });

    $("#add-employee-form").on("submit", function (event) {
        event.preventDefault();
        let name = $("#employee-name").val().trim();
        let position = $("#employee-position").val().trim();
        let cin = $("#employee-cin").val().trim().toUpperCase();
        let email = $("#employee-email").val().trim();
        let phone = $("#employee-phone").val().trim();
        let skills = $("#employee-skills").val().trim();

        $.ajax({
            url: "../php/employee/addEmployee.php",
            method: "POST",
            dataType: "json",
            data: {
                name: name,
                position: position,
                cin: cin,
                email: email,
                phone: phone,
                skills: skills,
            },
            success: function (data) {
                showMessage(data);
                if (data.status == "success") {
                    $("#add-employee-form")[0].reset();
                    fetchEmployees();
                }
            },
            error: function (error) {
                console.error("Error adding employee:", error);
            },
        });
    });

    $("#update-employee-form").on("submit", function (event) {
        event.preventDefault();
        let id = $(this).data("id");
        let name = $("#update-employee-name").val().trim();
        let position = $("#update-employee-position").val().trim();
        let cin = $("#update-employee-cin").val().trim().toUpperCase();
        let email = $("#update-employee-email").val().trim();
        let phone = $("#update-employee-phone").val().trim();
        let skills = $("#update-employee-skills").val().trim();

        $.ajax({
            url: "../php/employee/updateEmployee.php",
            method: "POST",
            dataType: "json",
            data: {
                id: id,
                name: name,
                position: position,
                cin: cin,
                email: email,
                phone: phone,
                skills: skills,
            },
            success: function (data) {
                showMessage(data);
                if (data.status == "success") {
                    $("#update-employee-form")[0].reset();
                    $(".employee-update").click();
                    fetchEmployees();
                }
            },
            error: function (error) {
                console.error("Error updating employee:", error);
            },
        });
    });

    function showMessage(data) {
        if (data.status == "success") {
            $(".message").css("background-color", "#51d371");
        } else {
            $(".message").css("background-color", "#ee5467");
        }
        $(".message").html(data.message);
        $(".message").addClass("show");
        setTimeout(() => {
            $(".message").removeClass("show");
        }, 1500);
    }

    function fetchUsers() {
        $.ajax({
            url: "../php/getUsers.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                const userList = $("#user-list");
                userList.empty();
                if (data.status == 1) {
                    fetchedUsers = data.data;
                    data.data.forEach(function (user) {
                        const userItem = `
                            <li class="user-item">
                                <div class="content">
                                    <p><strong>Username:</strong> <span>${user.username}</span></p>
                                    <p><strong>Role:</strong> <span>${user.role}</span></p>
                                </div>
                                <div class="action">
                                    <button class="edit-btn" data-id="${user.id}">Edit</button>
                                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                                </div>
                            </li>
                        `;
                        userList.append(userItem);
                    });
                } else {
                    userList.html(`<span>${data.message}</span>`);
                }
            },
            error: function (error) {
                console.error("Error fetching users:", error);
            },
        });
    }

    function fetchEmployees() {
        $.ajax({
            url: "../php/getEmployees.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                const employeeList = $("#employee-list");
                employeeList.empty();
                if (data.status == 1) {
                    fetchedEmployees = data.data;
                    data.data.forEach(function (employee) {
                        const employeeItem = `
                            <li class="employee-item">
                                <div class="content">
                                    <p><strong>Name:</strong> <span>${employee.name}</span></p>
                                    <p><strong>Position:</strong> <span>${employee.position}</span></p>
                                    <p><strong>Phone:</strong> <span>${employee.phone}</span></p>
                                </div>
                                <div class="action">
                                    <button class="edit-employee-btn" data-id="${employee.id}">Edit</button>
                                    <button class="delete-employee-btn" data-id="${employee.id}">Delete</button>
                                </div>
                            </li>
                        `;
                        employeeList.append(employeeItem);
                    });
                } else {
                    employeeList.html(`<span>${data.message}</span>`);
                }
            },
            error: function (error) {
                console.error("Error fetching employees:", error);
            },
        });
    }
});
