/**
 * Created by Chris on 7/27/2016.
 */
var assert = require('assert');
describe('DashboardChannel', function() {
    describe('dashboardChannel', function () {
        it("returns @ + the other user's username if a direct message, else returns # + the channel name", function () {

            var f = function(channel, user) {
                if(channel.substring(0, 3) === 'DM:') {
                    // returns @ + the other user's username. Example: if the user is chriscarducci, then in the strings
                    // 'DM: chriscarducci-davidblair' and 'DM: davidblair-chriscarducci', it will return @davidblair in both cases.
                    var meLoc = channel.indexOf(user);
                    var rtnStr;
                    if(meLoc===4) {
                        rtnStr = channel.substring(5 + user.length, channel.length);
                    }
                    else {
                        rtnStr = channel.substring(4, meLoc - 1);
                    }
                    return '@' + rtnStr;
                }
                else {
                    return '#' + channel;
                }
            };


            assert.equal('@davidblair', f('DM: chriscarducci-davidblair', 'chriscarducci'));
            assert.equal('@davidblair', f('DM: davidblair-chriscarducci', 'chriscarducci'));

            assert.equal('@chriscarducci', f('DM: chriscarducci-davidblair', 'davidblair'));
            assert.equal('@chriscarducci', f('DM: davidblair-chriscarducci', 'davidblair'));

            assert.equal('@sangDev', f('DM: jak464-sangDev', 'jak464'));
            assert.equal('@sangDev', f('DM: sangDev-jak464', 'jak464'));

            assert.equal('@jak464', f('DM: jak464-sangDev', 'sangDev'));
            assert.equal('@jak464', f('DM: sangDev-jak464', 'sangDev'));

            assert.equal('#general', f('general', 'jak464'));
        });
    });
});