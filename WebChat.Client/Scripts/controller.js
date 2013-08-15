/// <reference path="q.js" />

/// <reference path="jquery-2.0.3.js" />
/// <reference path="data-layer.js" />
var WebChat = WebChat || {};

WebChat.Controller = (function () {
    var serviceRoot = "http://bugsbunnywebchat-1.apphb.com/api/";

    var UsersController = Class.create({
        init: function () {
            this.data = WebChat.Data.getDataPersister(serviceRoot);
        },

        createUser: function (userName) {
            return this.data.users.createUser(userName);
        },

        getAllUsers: function () {
            var allUsers = this.data.users.getOnlineUsers();
            return allUsers;
        },
        

        currentUser: function (name) {
            return this.data.users.getUserId(name);
        },

        currentUserId: function () {
            return this.data.users.currentUserId();
        },

        userName: function () {
            return this.data.users.currentUserName();
        }

    });

    var ChannelsController = Class.create(
        {
            init: function () {
                this.data = WebChat.Data.getDataPersister(serviceRoot);
            },

            openChannel: function (sender, reciever) {
                return this.data.channels.openChannel(sender, reciever);
                
            },

            returnOpenedChannels: function (userId) {
                return this.data.channels.returnOpenedChannels(userId);
            }
        }
        );

    return {
        getUserController: function () { return new UsersController() },
        getChannelsController: function() { return new ChannelsController()}
     }

}())