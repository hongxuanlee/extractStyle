module.exports = function(defaultStyles, root, loopElement) {
     var filterDefaultStyle = function(defaultStyles, sources) {
        for (var key in sources) {
            if (sources[key] === defaultStyles[key]) {
                delete sources[key];
            }
        }
        return sources;
    };

    var isLoopElem = function(elemClassName){
        for(var i = 0; i < loopElement.length; i++){
           if(elemClassName.indexOf(loopElement[i]) > -1){
                return true;
            }
        };
        return false;
    }

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
            var className = elem.className.trim();
            var styles = getStyles(elem, config);
            var tag = elem.tagName.toLowerCase();
            nodeInfo.className = className;
            nodeInfo.styles = styles;
            nodeInfo.tag = tag;
            var children = Array.prototype.slice.call(elem.childNodes);
            var childArr = [];
            if(className){
                nodeInfo.isLoop = isLoopElem(className);
            }
            if(children.length === 1 && children[0].nodeType === 3 && tag !== 'a'){
                var subElem = children[0];
                var text = subElem.nodeValue.trim();
                if (text.length > 0) {
                    nodeInfo.tag = 'textNode';
                    nodeInfo.text = text;
                }
            }else if (children.length > 0) {
                for (var i = 0; i < children.length; i++) {
                    var child = getTree(children[i], config);
                    // if is loop element , skip this loop...
                    if (child) {
                        childArr.push(child);
                        if (child.isLoop) {
                            i = children.length;
                        }
                    }
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
        var rootElem = document.querySelector(name);
        if (!rootElem) {
            throw error('not valid element!');
        }
        var styleKeys = Object.keys(defaultStyles);
        return getTree(rootElem, styleKeys);
    }

    return getElementandStyles(root);
};
