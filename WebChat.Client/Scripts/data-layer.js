/// <reference path="q.js" />

/// <reference path="class.js" />
/// <reference path="http-requester.js" />
var WebChat = WebChat || {};

WebChat.Data = (function () {

    var DataPersister = Class.create({
        init: function (serviceRootUrl) {
            this.serviceRootUrl = serviceRootUrl;

            this.users = new UserPersister(serviceRootUrl + "users/");
            this.channels = new ChannelsPersister(serviceRootUrl + "channels/");
        },
    });

    var UserPersister = Class.create({
        init: function (serviceRootUrl) {
            this.serviceRootUrl = serviceRootUrl;
            this.currentId;
            this.name;
        },

        getOnlineUsers: function (id) {
            var requesturl = this.serviceRootUrl;
            if (id) {
                requesturl += ('?id=' + id);
            }

            return HttpRequester.getJson(requesturl);
        },
        createUser: function (username) {
            var self = this;
            var options = {
                UserName: username
            };
            return HttpRequester.postJson(this.serviceRootUrl, options)
                .then(function (data) {
                    self.currentId = data;
                    self.name = username;
                });
        },

        getUserId: function (name) {
            return HttpRequester.getJson(this.serviceRootUrl + "?name=" + name);
        },

        currentUserId: function () {
            return this.currentId;
        },

        currentUserName: function () {
            return this.name;
        },

        // http://localhost:58027/api/Users?userId=276
        logout: function (userId) {

            return HttpRequester.postJson(this.serviceRootUrl + "?userId=" + userId, {});
        }

    });

    var ChannelsPersister = Class.create({
        init: function (serviceRootUrl) {
            this.serviceRootUrl = serviceRootUrl;
        },

        openChannel: function (senderId, recieverId) {
            return HttpRequester.getJson(this.serviceRootUrl + "?SenderId=" + senderId + "&RecieverId=" + recieverId);
        },

        returnOpenedChannels: function (userId) {
            var service = this.serviceRootUrl.substring(0, this.serviceRootUrl.length - 1);
            var options = {
                userId: userId
            };
            return HttpRequester.postJson(service + "?userId=" + userId, options);
        }
    });

    return {
        getDataPersister: function (serviceRootUrl) { return new DataPersister(serviceRootUrl); }
    }
}())