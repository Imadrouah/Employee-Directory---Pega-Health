$.ajax({
    url: "../php/isLogged.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
        if (!data.logged_in) {
            window.location.href = "../login.html";
        } else {
            if (data.role === "admin") {
                $(".loader").addClass("stop");
            } else {
                window.location.href = "../index.html";
            }
        }
    },
    error: function (error) {
        console.error("Error checking login status:", error);
    },
});
$(document).ready(function () {
    let fetchedNotifications;
    $("#date").attr("min", new Date().toLocaleDateString("en-ca"));
    $("#update-date").attr("min", new Date().toLocaleDateString("en-ca"));
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

    $("#notification-form").on("submit", function (e) {
        e.preventDefault();
        let title = $("#title").val().trim();
        let date = $("#date").val();
        let description = $("#description").val().trim();
        $.ajax({
            url: "../php/notification/addNotification.php",
            method: "post",
            dataType: "json",
            data: { title: title, date: date, description: description },
            success: function (data) {
                showMessage(data);
                if (data.status == "success") {
                    $(this).reset();
                }
            },
            error: function (error) {
                console.error("Error adding notifications:", error);
            },
        });
    });
    $(".close-update").on("click", function () {
        $("#update-form").removeClass("open");
    });
    $(document).on("click", function (e) {
        if ($(e.target).hasClass("update")) {
            let id = $(e.target).data("id");
            $("#update-form").addClass("open");
            let title = fetchedNotifications.find((n) => n.id == id).title;
            let date = fetchedNotifications.find((n) => n.id == id).date;
            let desc = fetchedNotifications.find((n) => n.id == id).description;

            $("#update-form").attr("data-id", id);

            $("#update-title").val(title);
            $("#update-date").val(date);
            $("#update-description").val(desc);
        } else if ($(e.target).hasClass("delete")) {
            let id = $(e.target).data("id");
            $.ajax({
                url: "../php/notification/deleteNotification.php",
                method: "post",
                dataType: "json",
                data: { id: id },
                success: function (data) {
                    showMessage(data);
                },
                error: function (error) {
                    console.error("Error deleting notifications:", error);
                },
            });
        }
    });

    $("#update-form").on("submit", function (e) {
        e.preventDefault();
        let id = $(this).data("id");
        let title = $("#update-title").val();
        let date = $("#update-date").val();
        let description = $("#update-description").val();
        $.ajax({
            url: "../php/notification/updateNotification.php",
            method: "post",
            dataType: "json",
            data: {
                id: id,
                title: title,
                date: date,
                description: description,
            },
            success: function (data) {
                showMessage(data);
                if (data.status == "success") {
                    $("#update-form")[0].reset();
                    $(".close-update").click();
                }
            },
            error: function (error) {
                console.error("Error updating notifications:", error);
            },
        });
    });

    fetchDashboardData();

    fetchNotifications();

    function showMessage(data) {
        if (data.status == "success") {
            $(".message").css("background-color", "#51d371");
            fetchNotifications();
        } else {
            $(".message").css("background-color", "#ee5467");
        }
        $(".message").html(data.message);
        $(".message").addClass("show");
        setTimeout(() => {
            $(".message").removeClass("show");
        }, 1500);
    }

    function fetchDashboardData() {
        $.ajax({
            url: "../php/getDashboardData.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                $(".stats").empty();
                let totaleAdmins = `
                                        <div class="box">
                                            <i class="fa-solid fa-gear fa-xl"></i>
                                            <div>
                                                <span>${data.total_admins}</span>
                                                <span>Total Admin</span>
                                            </div>
                                        </div>
                `;
                let totaleUsers = `
                                        <div class="box">
                                            <i class="fa-solid fa-circle-user fa-xl"></i>
                                            <div>
                                                <span>${data.total_users}</span>
                                                <span>Total Users</span>
                                            </div>
                                        </div>
                                        `;
                let totaleEmployees = `
                                        <div class="box">
                                            <i class="fa-solid fa-user-tie fa-xl"></i>
                                            <div>
                                                <span>${data.total_employees}</span>
                                                <span>Total Employees</span>
                                            </div>
                                        </div>
                                        `;
                let monthEvents = `
                                        <div class="box">
                                            <i class="fa-regular fa-calendar-days fa-xl"></i>
                                            <div>
                                                <span>${data.month_events}</span>
                                                <span>This Month Events</span>
                                            </div>
                                        </div>
                                        `;
                let posTable = `<table id="pos-table" border="1">
                                    <tr>
                                        <th>Position</th>
                                        <th>Employees</th>
                                    </tr>`;
                data.pos_data.forEach((pos_data) => {
                    posTable += `
                            <tr>
                                <td>${pos_data.position}</td>
                                <td>${pos_data.total}</td>
                            </tr>
                    `;
                });
                posTable += `</table>`;
                $(".stats").html(`
                                    <div >
                                        ${totaleAdmins}
                                        ${totaleUsers}
                                        ${totaleEmployees}
                                        ${monthEvents}
                                    </div>
                                    ${posTable}
                                `);
            },
            error: function (error) {
                console.error("Error fetching dashboard data:", error);
            },
        });
    }

    function fetchNotifications() {
        $.ajax({
            url: "../php/getNotifications.php",
            method: "GET",
            dataType: "json",
            success: function (data) {
                const notificationsContainer = $("#notifications-list");
                notificationsContainer.empty();
                if (data.status == 1) {
                    fetchedNotifications = data.data;
                    data.data.forEach((noti) => {
                        const notificationItem = `
                                <li class="notification-item">
                                    <div class="notification">
                                        <h3>${noti.title}</h3>
                                        <p>${noti.description}</p>
                                    </div>
                                    <div class="action">
                                        <button class="update" data-id=${noti.id}>Update</button>
                                        <button class="delete" data-id=${noti.id}>Delete</button>
                                    </div>
                                </li>
                            `;
                        notificationsContainer.append(notificationItem);
                    });
                } else {
                    notificationsContainer.html(`<span>${data.message}</span>`);
                }
            },
            error: function (error) {
                console.error("Error fetching notifications:", error);
            },
        });
    }
});
