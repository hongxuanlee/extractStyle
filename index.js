const path = require('path');

const child_process = require('child_process');
const spawn = child_process.spawn;

const phantomjs = require('phantomjs');
const binPath = phantomjs.path;

const PHANTOMJS_DIR = path.join(__dirname, 'phantomjs');
const PHANTOMJS_FILE = path.join(PHANTOMJS_DIR, 'main.js');

class Extractor {
    constructor(url, dirname, cb, option) {
        this.url = url;
        this.dirname = dirname;
        this.cb = cb;
        this.option = option || {};
        this.cookie = this.option.cookie || '';
        this.init();
    }
    init() {
        this.process();
    }
    process() {
        let self = this;
        let proc = spawn(binPath, [PHANTOMJS_FILE, self.url, self.dirname, self.cookie], {
            stdio: "inherit"
        });
        proc.on('exit', () => {
            self.cb();
        });
    }
}

module.exports = Extractor;
