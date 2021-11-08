async function getTheUsers() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            json = resolve(this.responseText);
            resolve(this.responseText);
        };
        xhr.onerror = reject;
        xhr.open('GET', "https://615485ee2473940017efaed3.mockapi.io/assessment");
        xhr.send();
    });
}


