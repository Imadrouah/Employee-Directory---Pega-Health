$.ajax({
    url: "php/isLogged.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
        if (data.logged_in) {
            window.location.href = "index.html";
        } else {
            $(".loader").addClass("stop");
        }
    },
    error: function (error) {
        console.error("Error checking login status:", error);
    },
});
$(document).ready(function () {
    if (localStorage.getItem("theme") == "dark") {
        $("html").addClass("dark");
    } else {
        $("html").removeClass("dark");
    }
    function shake(tag) {
        tag.addClass("shake");
        setTimeout(() => {
            tag.removeClass("shake");
        }, 1000);
    }
    $("#password").on("input", function () {
        if ($("#password").val().length > 0) {
            $("#eye").addClass("show");
        } else {
            $("#eye").removeClass("show");
        }
    });
    $("#eye").on("click", function () {
        $(this).toggleClass("fa-eye");
        $(this).toggleClass("fa-eye-slash");
        if ($(this).hasClass("fa-eye-slash"))
            $("#password").attr("type", "text");
        else if ($(this).hasClass("fa-eye"))
            $("#password").attr("type", "password");
    });
    $("form").on("submit", function (e) {
        e.preventDefault();
        let user = $("#username").val();
        let pass = $("#password").val();

        $.ajax({
            url: "php/login.php",
            method: "POST",
            data: {
                username: user,
                password: pass,
            },
            dataType: "json",
            success: function (data) {
                if (data.status) {
                    window.location.href = "index.html";
                } else {
                    shake($("#username"));
                    shake($("#password"));
                    $("#error-message").text(data.details).show();
                }
            },
            error: function (error) {
                console.error("Error while trying to login:", error);
            },
        });
    });
});
