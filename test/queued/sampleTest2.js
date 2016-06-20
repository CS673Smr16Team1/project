/**
 * Created by sangjoonlee on 2016-06-14.
 */
var assert = require('assert'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver');

test.describe('Google Search', function() {
    this.timeout(15000);

    test.it('should work', function() {
        this.timeout(20000);
        var driver = new webdriver.Builder().

        withCapabilities(webdriver.Capabilities.chrome()).
        build();

        driver.get('http://52.72.17.21:3000/');

        var searchBox = driver.findElement(webdriver.By.keyIdentifier('Log In'));

        searchBox.sendKeys('software engineering');
        searchBox.getAttribute('value').then(function(value) {
            assert.equal(value, 'software engineering');
        });
        //driver.quit();
    });
});