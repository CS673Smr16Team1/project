/**
 * Created by Chris on 6/18/2016.
 */
    // http://lollyrock.com/articles/nodejs-encryption/
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'a6C3Efbq';

var f1 = function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

var f2 = function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};


module.exports = {
    encrypt: f1,
    decrypt: f2
};