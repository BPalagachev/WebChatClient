/// <reference path="q.js" />

/// <reference path="jquery-2.0.3.js" />
/// <reference path="data-layer.js" />

var WebChat = WebChat || {};

WebChat.ClientUI = (function () {
    var userController = WebChat.Controller.getUserController();
    return {
        loginForm: function () {
            var html =
                '<div class="login">' +
                '	<form>' +
                '		<input type="text" id ="login-name"/>' +
                '		<button id="login-submit">LogIn</button>' +
                '	</form>' +
                '</div>';
            return html;
        },

        usersList: function () {
            var html = '<div id="users-online-container">';
            html += '<ul id="users-ul">';

           return userController.getAllUsers()
            .then(function (data) {
                $.each(data, function (i, val) {
                    html += ("<li><a href='#' data-userId="+val.Id+" class='online-user'>"+ val.Name+"</a></li>");
                });
                return html;
            });
        },

        chatContainer: function () {
            var html = '<div id="char-body"></div>';
            return html;
        },

        charWindow: function (userId, recieverName) {
            var html = '<div data-userId = "' + userId + '" id="chat-body-' + userId + '">';
            html += '<p>Chat with: ' + recieverName + '</p>';
                html += '<textarea id="chat-area-' + userId + '"></textarea>';
                html += '<input id="input-sendto-' + userId + '"/>';
                html += '<button class="btn-send" id="btn-sendto-' + userId + '" data-userid="'+userId+'">Send</button>';
                html += '</div>';
            return html;
        },


    }
}())