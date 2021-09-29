const moment = require('moment');
const users = [];

module.exports = {
    formatMsg: function(user, text) {
        return {
            user,
            text,
            time: moment().format('HH:m')
        }
    },
    userJoin: function(id, username, room) {
        const user = {id, username, room};
        users.push(user);
        return user;
    },
    getCurrentUser: function(id) {
        return users.find(user => user.id === id);
    },
    userLeave: function(id) {
        const index = users.findIndex(user => user.id === id);
        if(index !== -1) {
            return users.splice(index, 1)[0];
        }
    },
    getRoomUsers: function(room){
        return users.filter(user => user.room === room);
    }
}