let loggedUsername;
$.ajax({
    url: "php/isLogged.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
        if (!data.logged_in) {
            window.location.href = "login.html";
        } else {
            loggedUsername = data.username;
            $(".loader").addClass("stop");
            if (data.role === "admin") {
                $(".profile-icons").prepend(`
                                            <a class="admin-btn" href="admin/index.html">
                                                <i class="fa-solid fa-user-gear fa-lg"></i>
                                            </a>
                                            `);
            }
        }
    },
    error: function (error) {
        console.error("Error checking login status:", error);
    },
});
$(document).ready(function () {
    $(".activity-icon").on("click", function () {
        $(".activity").addClass("show");
        fetchActivityLogs();
    });

    function updateTime() {
        $(".time").html(
            new Date().toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
        );
    }

    updateTime();
    setTimeout(function () {
        updateTime();
        setInterval(updateTime, 60000);
    }, (60 - new Date().getSeconds()) * 1000);

    $(".close-activity").on("click", function () {
        $(".activity").removeClass("show");
    });
    $(".notice-icon").on("click", function () {
        $(".notice").addClass("show");
        fetchNotifications();
    });
    $(".close-notice").on("click", function () {
        $(".notice").removeClass("show");
    });
    $(".close-profile").on("click", function () {
        $(".user-profile").removeClass("show");
    });

    if (localStorage.getItem("theme") == "dark") {
        $("html").addClass("dark");
        $(".darklight").html("dark");
    } else {
        $("html").removeClass("dark");
        $(".darklight").html("light");
    }
    $(".theme").on("click", function () {
        $("html").toggleClass("dark");
        if ($("html").hasClass("dark")) {
            $(".darklight").html("dark");
        } else {
            $(".darklight").html("light");
        }
        localStorage.setItem(
            "theme",
            $("html").hasClass("dark") ? "dark" : "light"
        );
    });
    $(".user-btn").on("click", function () {
        $("#update-form")[0].reset();
        $("#update-username").val(loggedUsername);
        $(".user-profile").addClass("show");
        $("#update-username").focus();
        $("#old-password").removeAttr("required");
    });
    $(".logout-btn").on("click", function () {
        $.ajax({
            url: "php/logout.php",
            method: "GET",
            success: function () {
                window.location.href = "login.html";
            },
            error: function (error) {
                console.error("Error loggin out:", error);
            },
        });
    });
    fetchEmployees();

    $("#search").on("keyup", function (e) {
        const query = $(this).val().toLowerCase().trim();
        if (query.length > 0 && e.key == "Enter") searchEmployees(query);
    });
    $(".fa-magnifying-glass").on("click", function (e) {
        const query = $("#search").val().toLowerCase().trim();
        if (query.length > 0) searchEmployees(query);
    });
    $(".close").click(resetSearch);
    function fetchActivityLogs() {
        $.ajax({
            url: "php/getActivityLogs.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                displayActivityLogs(data);
            },
            error: function (error) {
                console.error("Error fetching activity logs:", error);
            },
        });
    }
    $("#update-password").on("input", function () {
        if ($(this).val().trim().length > 0) {
            $("#old-password").attr("required", true);
        } else {
            $("#old-password").removeAttr("required");
        }
    });
    $("#update-form").on("submit", function (event) {
        event.preventDefault();
        let username = $("#update-username").val().trim();
        let oldPassword = $("#old-password").val().trim().length
            ? $("#old-password").val().trim()
            : null;
        let password = $("#update-password").val().trim().length
            ? $("#update-password").val().trim()
            : null;

        if (
            loggedUsername !== username ||
            (password && password !== oldPassword)
        ) {
            $.ajax({
                url: "php/updateProfile.php",
                method: "POST",
                dataType: "json",
                data: {
                    username: username,
                    password: password,
                    oldPassword: oldPassword,
                },
                success: function (data) {
                    showMessage(data);
                    if (data.status == "success") {
                        $("#update-form")[0].reset();
                        $(".close-profile").click();
                        loggedUsername = username;
                    }
                },
                error: function (error) {
                    console.error("Error updating profile:", error);
                },
            });
        } else {
            $(".close-profile").click();
        }
    });
    function displayActivityLogs(logData) {
        const logContent = $(".activity-content");
        logContent.empty();

        if (logData.status == 0) {
            logContent.append(`<p>${logData.message}</p>`);
            return;
        }

        logData.data.forEach((log) => {
            const logElement = `
            <div class="log-entry">
                <div class="log-timestamp">
                    <span>${new Date(log.timestamp).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    })}</span>
                </div>
                <div class="log-info">
                    <strong>${log.username}</strong>
                    <p>${log.action}</p>
                </div>
            </div>
        `;
            logContent.append(logElement);
        });
    }

    function fetchNotifications() {
        $.ajax({
            url: "php/getNotifications.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                displayNotifications(data);
            },
            error: function (error) {
                console.error("Error fetching notifications:", error);
            },
        });
    }

    function displayNotifications(notiData) {
        const noticeContent = $(".notice-content");
        noticeContent.empty();

        if (notiData.status == 0) {
            noticeContent.append(`<p>${notiData.message}</p>`);
            return;
        }

        notiData.data.forEach((notification) => {
            const eventElement = `
            <div class="event">
                <div class="time">
                    <span>${new Date(notification.date).toLocaleString(
                        "default",
                        { month: "short", year: "numeric" }
                    )}</span>
                    <span>${new Date(notification.date).getDate()}</span>
                </div>
                <div class="info">
                    <h3>${notification.title}</h3>
                    <p>${notification.description}</p>
                </div>
            </div>
        `;
            noticeContent.append(eventElement);
        });
    }

    function resetSearch() {
        $(".close").css("display", "none");
        fetchEmployees();
        $("#search").val("");
    }

    function searchEmployees(query) {
        $(".close").css("display", "block");
        $.ajax({
            url: "php/search.php",
            method: "post",
            dataType: "json",
            data: { query: query },
            success: function (data) {
                displayEmployees(data);
            },
            error: function (error) {
                console.error("Error searching employees:", error);
            },
        });
    }

    function fetchEmployees() {
        $.ajax({
            url: "php/getEmployees.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                displayEmployees(data);
            },
            error: function (error) {
                console.error("Error fetching employees:", error);
            },
        });
    }

    function displayEmployees(employees) {
        const employeeList = $("#employee-list");
        employeeList.empty();

        if (employees.status == 0) {
            employeeList.append(`<p>${employees.message}</p>`);
            return;
        }
        employees.data.forEach((employee) => {
            const employeeItem = $("<div></div>");
            employeeItem.addClass("employee-item");
            employeeItem.html(`
                <div class="info">
                    <span>${employee.name}</span>
                    <span>${employee.position}</span>
                </div>
                <div class="contact">
                    <span><i class="fa-regular fa-envelope"></i>   ${employee.email}</span>
                    <span><i class="fa-solid fa-phone"></i>   ${employee.phone}</span>
                </div>
            `);

            employeeItem.on("click", function () {
                showProfilePopup(employee);
            });

            employeeList.append(employeeItem);
        });
        setTimeout(() => {
            employeeList.addClass("animate");
        }, 100);
    }

    function showProfilePopup(employee) {
        const popup = $("#profile-popup");
        let skills = "";
        employee.skills.split(",").forEach((skill) => {
            skills += `<span class="skill" >${skill.trim()}</span>`;
        });
        popup.html(`
            <div class="popup-content">
                <span class="close-btn"><i class="fa-solid fa-xmark fa-xl"></i></span>
                <h2>${employee.name}</h2>
                <p><strong>Position: </strong>${employee.position}</p>
                <p><strong>Email: </strong>${employee.email}</p>
                <p><strong>Phone: </strong>${employee.phone}</p>
                <p><strong>Skills: </strong><span class="skills">${skills}</span></p>
                <a href="mailto:${employee.email}" class="btn"><i class="fa-regular fa-paper-plane"></i></a>
                
            </div>
        `);
        popup.addClass("show");

        $(".close-btn").on("click", function () {
            popup.removeClass("show");
        });
    }
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
});
