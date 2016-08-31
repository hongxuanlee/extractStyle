const path = require('path');

const child_process = require('child_process');
const spawn = child_process.spawn;

const phantomjs = require('phantomjs');
const binPath = phantomjs.path;

const PHANTOMJS_DIR = path.join(__dirname, 'src');
const PHANTOMJS_FILE = path.join(PHANTOMJS_DIR, 'main.js');

class Extractor {
    constructor(url, option, cb) {
        this.url = url;
        this.option = option || {};
        this.selector = this.option.selector;
        this.loopElem = this.option.loopElem || '';
        this.dirName = this.option.dirName;
        this.cb = cb;
        this.init();
    }
    init() {
        this.process();
    }
    process() {
        let self = this;
        let proc = spawn(binPath, [PHANTOMJS_FILE, self.url, self.selector, self.loopElem, self.dirName], {
            stdio: "inherit"
        });
        proc.on('exit', () => {
            self.cb();
        });
    }
}

module.exports = Extractor;
