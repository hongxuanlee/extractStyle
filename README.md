###  extract style from exist page

- extract exist page style
- convert to rx standard

#### usage 

- in apply dir
```
let extractor = new Extractor('http://market.wapa.taobao.com/wh/tms/taobao/page/markets/2016xsx/market/page/test?wh_ttid=phone', {
    selector: '.listview-items',
    loopElem: 'listview-item',
    dirName: path.join(__dirname, 'shop')
}, () => {
    console.log('task done!');
});
```

- and style and templete generate in apply/shop.

#### todo
- more style exact 
