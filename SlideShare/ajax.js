// method: HTTP request method (POST, GET, PUT/PATCH, DELETE)
// XMLHttpRequest.open(method, url)

// XMLHttpRequest.readyState
// XMLHttpRequest.UNSENT; // 0
// XMLHttpRequest.OPENED; // 1
// XMLHttpRequest.HEADERS_RECEIVED // 2
// XMLHttpRequest.LOADING; // 3
// XMLHttpRequest.DONE; // 4

xhr = new XMLHttpRequest();

url = 'somePlace' // in current domain

xhr.open('GET', 'url');

xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 

xhr.onreadystatechange = function () {
    try {
        console.log(xhr.readyState);
        console.log(xhr.responseText);
    } catch (e) {
        alert('Caught Exception: ' + e.description)
    }
}

xhr.send();