// Fetch API with Promise

fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .then(data => {
        console.log("Users:", data);
    })
    .catch(error => {
        console.log("Error:", error);
    });
