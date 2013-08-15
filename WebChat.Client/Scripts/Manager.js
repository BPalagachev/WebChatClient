/// <reference path="q.js" />

/// <reference path="jquery-2.0.3.js" />
/// <reference path="data-layer.js" />
/// <reference path="controller.js" />


var WebChat = WebChat || {};

WebChat.Manager = (function () {
    var isLogged = false;
    var userController = WebChat.Controller.getUserController();
    var channelController = WebChat.Controller.getChannelsController();
    var cnt;

    function buildUi(containter) {
        cnt = containter;

        attachEvents(containter);

        if (isLogged == false) {
            var loginForm = WebChat.ClientUI.loginForm();
            $(containter).append(loginForm);

        } else {
            DrawUI(containter);
        }

    }

    function attachEvents(containter) {
        $(containter).on("click", "#login-submit", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var username = $("#login-name").val();
            CreateOrLoadUserName(username);
            DrawUI(cnt);
        });

        $(containter).on("click", ".online-user", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var userId = userController.currentUserId();
            var reciever = $(this).data("userid");
            var recieverName = $(this).html();

            channelController.openChannel(userId, reciever).then(function (data) {
                var html = WebChat.ClientUI.charWindow(reciever, recieverName);

                if (!$("#chat-body-" + reciever).html()) {
                    $(cnt).append(html);
                    $("#chat-body-" + reciever).data("channelName", data);
                    subscribePubnub(data, "chat-area-" + reciever);
                } 
            });
        })

        $(containter).on("click", ".btn-send", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var reciever = $(this).data("userid");
            var channelName = $("#chat-body-" + reciever).data("channelName")
            publish(channelName, "#input-sendto-" + reciever);

        });
    }

    function CreateOrLoadUserName(username) {
        userController.createUser(username);
        isLogged = true;
    }

    function DrawUI(container) {
        ClearPage(container);
        DrawOnlineUsers(container);
        setInterval(function () {
            OpenPendingChats(container);
        },
        1000);
    }

    function ClearPage(container) {
        $(container).html("");
    }

    function DrawOnlineUsers(container) {
        var html;
        var usersUl = WebChat.ClientUI.usersList().then(function (data) {
            data += '</ul>';
            data += '</div>';
            html = data;
            $(container).append(html);
        });
    }

    function DrawChatBoard(container) {
        var html = WebChat.ClientUI.chatContainer();
        $(container).append(html);
    }

    function OpenPendingChats(container) {
        var id = userController.currentUserId();
        channelController.returnOpenedChannels(id).then(function (data) {

            for (var i = 0; i < data.length; i++) {
                var creatorName = data[i].UserName;
                var creatorId = data[i].UserId;

                var html = WebChat.ClientUI.charWindow(creatorId, creatorName);
                $(cnt).append(html);
                $("#chat-body-" + creatorId).data("channelName", data[i].Name);
                subscribePubnub(data[i].Name, "chat-area-" + creatorId);

            }
        });
    }

    function subscribePubnub(channelStr, textAreaId) {
        //var pubnub = PUBNUB.init({
        //    publish_key: 'demo',
        //    subscribe_key: 'demo'
        //});

        PUBNUB.subscribe({
            channel: channelStr,
            callback: function (message) {
                // Received a message --> print it in the page
                document.getElementById(textAreaId).innerHTML += message + '\n';
            }
        })
    }

    function publish(channel, msgContainer) {
        console.log($(msgContainer).val());
        PUBNUB.publish({
            channel: channel,
            message: userController.userName() + ': ' + $(msgContainer).val()
        });
        message: $(msgContainer).val('')
    }



    return ({
        buildUi: buildUi
    })

}())