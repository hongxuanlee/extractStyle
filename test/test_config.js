const expect = require('chai').expect;

describe("read config", () => {
    let tree = getTree();
    it("should get dom tree", () => {
        expect(tree).to.not.equal(null);
    });
});