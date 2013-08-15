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
                     html += ("<li>" +
                         "<img src='" + val.PictureUrl + "' height='20' width='20'>" +
                         "<a href='#' data-userId=" + val.Id + " class='online-user'>" + val.Name + "</a>" +
                         "</li>");
                 });
                 return html;
             });
        },

        chatContainer: function () {
            var html = '<div id="char-body"></div>';
            return html;
        },

        charWindow: function (userId, recieverName) {
            var html = '<div class="chat-container" data-userId = "' + userId + '" id="chat-body-' + userId + '">';
            html += '<p>Chat with: ' + recieverName + '</p>';
            html += '<textarea disabled="disabled" class="chat-area" id="chat-area-' + userId + '"></textarea>';
            html += '</br><input class="input-area" id="input-sendto-' + userId + '"/>';
            html += '<button class="btn-send" id="btn-sendto-' + userId + '" data-userid="' + userId + '">Send</button>';
            html += '</div>';
            return html;
        },

        userInfo: function (userName, picUrl) {
            var html =
                '<p>' +
                '	<h1>Bugs Bunny\'s Favorite Web Chat</h2>' +
                '	<img src="' + picUrl + '" height="42" width="42">' +
                '	Hello, <span id="user-name">' + userName + '</span>' +
                '	<button id="btn-user-logoff">log out</button>' +
                '</p>';

            return html;
        }
    }
}())