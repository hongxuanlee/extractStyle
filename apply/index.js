const Extractor = require('../index.js');
console.log(Extractor);
const path = require('path');

let extractor = new Extractor('http://market.wapa.taobao.com/wh/tms/taobao/page/markets/2016xsx/market/page/test?wh_ttid=phone', {
    selector: '.listview-items',
    loopElem: 'listview-item',
    dirName: path.join(__dirname, 'shop')
}, () => {
    console.log('task done!');
});

