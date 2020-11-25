fetch('http://localhost:8000/api.js')
    .then(response => response.statusText)
    .then(statusText => console.log(statusText));