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
        isLogged = false;

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

        $(containter).on("click", "#btn-user-logoff", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var userId = userController.currentUserId();
            userController.logout(userId).then(function () {
                isLogged = false;
                ClearPage(cnt);
                buildUi(cnt);
            });
        });

        $(containter).on("click", "#btn-pic-file", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            if ($('#pic-form').hasClass('hidden')) {
                $('#pic-form').removeClass()
            } else {
                $('#pic-form').addClass('hidden')
            }
        });

        $(containter).on("click", "#btn-pic-upload", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();

            var userId = userController.currentUserId();
            var picPath = $('#input-file-pic').val();
            //$('#input-file-pic').val('');
            $('#pic-form').addClass('hidden');
            var index = picPath.lastIndexOf('\\');
            var path = picPath.substring(0, index);
            var fileName = picPath.substring(index + 1, picPath.length);

            var data = {
                Name: fileName,
                Path: path,
                UserId: userId,
                IsProfilePic: true,
                RecieverId: 0
            };

            HttpRequester.postJson("http://bugsbunnywebchat-1.apphb.com/api/messages", data).then(function () {
                $("#header").remove();
                DrawUserInfo(cnt);
            });
            
        });

        
    }

    function CreateOrLoadUserName(username) {
        userController.createUser(username).then(function () {
            isLogged = true;
            DrawUserInfo(cnt);
        });
    }

    function DrawUI(container) {
        ClearPage(container);
        setInterval(function () {
            if (isLogged == true) {
                DrawOnlineUsers();
                OpenPendingChats(container);
            }
        },
        1000);
    }

    function ClearPage(container) {
        $(container).html("<div id='users-container'></div>");
    }

    function DrawUserInfo(container) {
        var userId = userController.currentUserId();
        userController.getAllUsers(userId).then(function (data) {
            var picUrl = data[0].PictureUrl;
            var userName = data[0].Name;
            var html = WebChat.ClientUI.userInfo(userName, picUrl);
            $(container).prepend(html);
        });
        
        
    }

    function DrawOnlineUsers() {
        var html = '';
        var usersUl = WebChat.ClientUI.usersList().then(function (data) {
            html += data;
            html += '</ul>';
            html += '</div>';
            var selector = "li a[data-userid='" + userController.currentUserId() + "']";

            $(selector).html('');
            var text = $(html);
            $('#users-container').html(text);
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

                if (!$("#chat-body-" + creatorId).html()) {
                    var html = WebChat.ClientUI.charWindow(creatorId, creatorName);
                    $(cnt).append(html);
                    $("#chat-body-" + creatorId).data("channelName", data[i].Name);
                    subscribePubnub(data[i].Name, "chat-area-" + creatorId);
                }
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