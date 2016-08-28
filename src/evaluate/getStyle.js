module.exports = function(defaultStyles, root) {
     var filterDefaultStyle = function(defaultStyles, sources) {
        for (var key in sources) {
            if (sources[key] === defaultStyles[key]) {
                delete sources[key];
            }
        }
        return sources;
    };

    var getStyles = function(elem, config) {
        var elemStyle = {};
        var filters = config;
        var styles = getComputedStyle(elem, null);
        filters.forEach(function(key) {
            elemStyle[key] = styles.getPropertyValue(key);
        });
        return filterDefaultStyle(defaultStyles, elemStyle);
    };

    var getTree = function(elem, config) {
        var nodeInfo = {};
        if (elem.nodeType === 1 && elem.tagName !== "SCRIPT" && elem.tagName !== "STYLE") {
            nodeInfo.tag = elem.tagName.toLowerCase();
            var styles = getStyles(elem, config);
            nodeInfo.styles = styles;
            var children = Array.prototype.slice.call(elem.childNodes);
            var childArr = [];
            if (children.length > 0) {
                for (var i = 0; i < children.length; i++) {
                    var child = getTree(children[i], config);
                    if (child) childArr.push(child);
                }
                nodeInfo.children = childArr;
            }
            return nodeInfo;
        } else if (elem.nodeType === 3) {
            var text = elem.nodeValue.trim();
            if (text.length > 0) {
                nodeInfo.tag = 'textNode';
                nodeInfo.text = text;
                return nodeInfo;
            }
        }
    };

    var getElementandStyles = function(name) {
        console.log(name);
        var rootElem = document.querySelector(name);
        if (!rootElem) {
            throw error('not valid element!');
        }
        console.log('.....', rootElem);
        var styleKeys = Object.keys(defaultStyles);
        console.log(styleKeys);
        return getTree(rootElem, styleKeys);
    }

    return getElementandStyles(root);
};