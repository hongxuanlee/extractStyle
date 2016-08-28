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
var convert = require('./convert.js');

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

var convertInfo = function(content){
    var templeteTokens = [];
    var styles = {};
    var res = convert(content, templeteTokens, styles);
    fs.write('apply/temp.jsx', templeteTokens.join('\n'));
    fs.write('apply/style.json', JSON.stringify(styles, null ,2));
    console.log('task done!');
    phantom.exit(0)
}

var getInfo = function(page, elemName, loopElem){
    var defaultStyles = getConfig();
    var loopElemClass = loopElem.split(',');
    var evaluateRet = evaluate(page, getStyle, defaultStyles, elemName, loopElemClass);
    convertInfo(evaluateRet)
};

var openPage = function(url, elemName, loopElem){
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
                getInfo(page, elemName, loopElem);
            }, TIMEOUT);
        }
    });
};

console.log('start');
// if (system.args.length === 1) {
//     phantom.exit(1);
// }
var url = system.args[1] || 'http://127.0.0.1:3333/mod/cm-item-prom/index.html';
var elemName = system.args[2] || '.item-02';
var loopElem = system.args[3] || 'item-02';
// test now
openPage(url, elemName, loopElem);
