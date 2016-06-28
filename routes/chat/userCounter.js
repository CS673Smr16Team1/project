/**
 * Created by Chris on 6/28/2016.
 */

var onlineUserCount=0;

var f1  = function() {
    onlineUserCount++;
};

var f2  = function() {
    onlineUserCount--;
};

var f3 = function() {
    return onlineUserCount;
}

module.exports = {
  incrementOnlineUsers: f1,
    decrementOnlineUsers: f2,
    getOnlineUserCount: f3
};