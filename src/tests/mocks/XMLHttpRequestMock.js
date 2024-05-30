const fs = require('fs');
const path = require('path');

class XMLHttpRequestMock {
    constructor() {
        this.status = 0;
        this.responseText = '';
    }

    open(method, url, async) {
        this.url = url;
    }

    send() {
        try {
            const fullPath = path.resolve(__dirname, this.url);
            this.responseText = fs.readFileSync(fullPath, 'utf8');
            this.status = 200;
        } catch (error) {
            this.status = 404;
            this.responseText = 'File not found';
        }
    }
}

module.exports = XMLHttpRequestMock;