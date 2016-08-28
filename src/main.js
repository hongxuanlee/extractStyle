phantom.onError = function (msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
        });
    }
    console.log(msgStack.join('\n'));
};

var WebPage = require('webpage');
var system = require('system');
var fs = require('fs');
var getStyle = require('./evaluate/getStyle.js');

// test now
var url = 'http://127.0.0.1:3333/mod/cm-item-prom/index.html';
var TIMEOUT = 100;

/**
 * to inject args to evaluate script
 */
var evaluate = function(){
    var args = Array.prototype.slice.call(arguments);
    var page = args[0];
    var arr = args.slice(1);
    return page.evaluate.apply(page, arr);
};

var getConfig = function(){
    var content = fs.read('./config.json');
    var defaultStyles = JSON.parse(content);
    return defaultStyles;
};

var getInfo = function(page){
    var defaultStyles = getConfig();
    var evaluateRet = evaluate(page, getStyle, defaultStyles, '.item-wrapper');
    console.log(JSON.stringify(evaluateRet,null,2));
};

var openPage = function(){
    var page = WebPage.create();
    page.onConsoleMessage = function(msg){
        console.log('[page]:', msg);
    };
    page.onError = function(msg, trace) {
        var msgStack = ['ERROR: ' + msg];
        if (trace && trace.length) {
            msgStack.push('TRACE:');
            trace.forEach(function (t) {
                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
            });
        }
        console.log(msgStack.join('\n'));
    };
    page.open(url, function(status) {
        if (status !== 'success') {
            console.log('FAIL to load this url');
        } else {
            console.log('finished');
            window.setTimeout(function(){
                getInfo(page);
            }, TIMEOUT);
        }
    });
};
console.log('start');
openPage();
