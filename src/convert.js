/*
 * convert token stream 
 */

var fs = require('fs');

var convertName = function(elemNode){
    var className = elemNode.className;
    var newClass;
    if(!className){
        var random = Math.ceil(Math.random()*100);
        newClass = elemNode.tag + random.toString();
    }else{
        className = className.split(' ')[0];
        newClass = className.replace(/-([a-z0-9])/g, function(item, match){
            if(match){
                return match.toUpperCase();
            }
        });
    }
    return newClass;
}

var convertHex = function(rgb){
   var rgbNum;
   rgb.replace(/rgb?\(([0-9,\s]*)\)/, function(item, match){
        if(match){
            rgbNum = match.split(',');
        }
    })
    if(!rgbNum) return rgb;
    var hexcode = '#';
    rgbNum.forEach(function(num){
        var res = parseInt(num.trim()).toString(16);
        res = (res.length === 1) ? '0' + res : res;
        hexcode += res;
    })
    return hexcode;
}

var convertStyle = function(styles){
    if (!styles) {
        return;
    }
    var cStyle = {}
    for(var key in styles){
        var name = key.replace(/-([a-z])/g, function(item, match){
            if(match){
                return match.toUpperCase();
            }
        })
        var value = styles[key].replace(/([0-9\.]*)px/, function(item, match){
            if(match){
                return Math.ceil(+match) + 'rem';
            }
        });
        if(key.indexOf('color') > -1){
            value = convertHex(value);
        }
        cStyle[name] = value
    }
    return cStyle;
};

var convertDiv = function(elemNode, styles){
    var className = convertName(elemNode);
    var style = convertStyle(elemNode.styles);
    if(style){
       if(styles[className]){
          className = className + '0';
       }
       styles[className] = style;
       return ['<View style={style.'+ className +'}>', '</View>'];
    }else{
       return ['<View>', '</View>'];
    }
}

var convertImg = function(elemNode, styles){
    var className = convertName(elemNode);
    var style = convertStyle(elemNode.styles);
    var src = elemNode.src || '';
    if(style){
       styles[className] = style;   
       return ['<Image style={style.'+ className +' source={uri:' + src+ '}/>'];
    }else{
       return ['<Image source={uri:' + src + '}/>'];
    }
}

var convertA = function(elemNode, styles) {
    var className = convertName(elemNode);
    var style = convertStyle(elemNode.styles);
    if (style) {
        styles[className] = style;
        return ['<Link style={style.' + className + '} href={}>', '</Link>'];
    } else {
        return ['<Link href={}>', '</Link>'];
    }
}

var convertText = function(elemNode, styles) {
    var className = convertName(elemNode);
    var style = convertStyle(elemNode.styles);
    var content = elemNode.text;
    if (style) {
        styles[className] = style;
        return ['<Text style={style.' + className + '}>', content + '</Text>'];
    } else {
        return ['<Text>',  content + '</Text>'];
    }
}

var convertOtherTage = function(elemNode, styles){
    var tag = elemNode.tag;
    var className = convertName(elemNode);
    var style = convertStyle(elemNode.styles);
    if (style) {
        styles[className] = style;
        return ['<'+ tag +' style={style.' + className + '}>', '</'+ tag +'>'];
    } else {
        return ['<'+ tag + '>', '</' + tag + '>'];
    }
}

var convert = function(elemNode, tokens, style, start){
    var templeteTokens = tokens || [];
    var styles = style || {};
    var tag = elemNode.tag;
    var start = start || 0;
    var token;
    if(tag === 'a'){
        token = convertA(elemNode, styles);
    }else if(tag === 'img'){
        token = convertImg(elemNode, styles);
    }else if(tag === 'textNode'){
        token = convertText(elemNode, styles);
    }else if(tag === 'li' || tag === 'ul'){
        token = convertOtherTage(elemNode, styles);
    }else{
        token = convertDiv(elemNode, styles);
    }
    var len = token.length;
    token.unshift(start, 0);
    [].splice.apply(templeteTokens, token)
    var children = elemNode.children;
    if(children && children.length){
         start = start + 1;
         for (var i = 0; i < children.length; i++) {
            var res = convert(children[i], templeteTokens, styles, start);
            start = res;
         }
         start = start + len - 1;
    }else{
        start = start + len;
    }
    return start;
};

module.exports = convert;

