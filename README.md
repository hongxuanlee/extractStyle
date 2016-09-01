###  extract style from exist page

- extract exist page style
- convert to rx(native) standard

#### example 
- just like apply dir

```
const Extractor = require('@ali/extract-rx-style');
let extractor = new Extractor('http://market.wapa.taobao.com/wh/tms/taobao/page/markets/2016xsx/market/page/test?wh_ttid=phone', {
    selector: '.listview-items',  // 选择器
    loopElem: 'listview-item',  //循环元素样式名，可避免重复生成
    dirName: path.join(__dirname, 'shop') // 生成文件目录
}, () => {
    console.log('task done!');
});
```

- style and templete generate in apply/shop.

#### todo
- more style exact 
