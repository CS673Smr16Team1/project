/**
 * Created by sangjoonlee on 2016-06-16.
 */
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
withCapabilities(webdriver.Capabilities.chrome()).
build();

driver.get('http://www.google.com');
driver.findElement(webdriver.By.name('q')).sendKeys('software engnineering');
driver.findElement(webdriver.By.name('btnG')).click();
//driver.quit();