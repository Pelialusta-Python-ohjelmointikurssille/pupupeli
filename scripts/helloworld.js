function helloworld() {
    return "Hello world!";
}

if (typeof document !== 'undefined'){
    document.body.innerHTML = helloworld();
}

module.exports = helloworld;