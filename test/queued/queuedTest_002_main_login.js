/**
 * Created by sangjoonlee on 2016-06-14.
 *
 * queuedTest_002_main_login.js
 *  - This test script uses local host to run the application and
 *  tests the home page login with test github account.
 */
var assert  = require('assert');
var webdriver = require('selenium-webdriver');
var test    = require('selenium-webdriver/testing');

test.describe('Google Search', function() {
    this.timeout(15000);

    test.it('should work', function() {
        // timeout duration for this test
        this.timeout(20000);

        var driver = new webdriver.Builder().

        withCapabilities(webdriver.Capabilities.chrome()).
        build();

        // Open web app - Development Test: localhost
        //                System Test: AWS Dev webserver
        //                Integration Test: release server
        driver.get('http://localhost:3000');

        // Find "Login with Github" button
        var searchBox = driver.findElement(webdriver.By.className('fa-github'));

        // Send click command on "Login with Github" button
        searchBox.click();
        //searchBox.click("navbar-ex-collapse");

        var gitLogin = driver.findElement(webdriver.By.id('login_field'));
        var password = driver.findElement(webdriver.By.id('password'));

        gitLogin.sendKeys('cs673smr16');
        password.sendKeys('cs673test');

        var enter = driver.findElement(webdriver.By.name('commit'));

        enter.click();

        //searchBox.getAttribute('value').then(function(value) {
        //    assert.equal(value, 'software engineering');
        //});
        //driver.quit();
    });

});