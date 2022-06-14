var userFormEl = document.getElementById("user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.getElementById("repo-search-term");
var languageButtonsEl = document.getElementById("language-buttons");

var getUserRepos = function(user) {
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then (function(data) {
                displayRepos(data, user);
        });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    });
    
}  

var formSubmitHandler = function(event) {
    event.preventDefault();
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
    // console.log(event);
}

var displayRepos = function (repos, searchTerm) {
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent= "No repositories found.";
        return;
    }

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo="+ repoName);

        // create span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repot has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class= 'fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class = 'fas fa-check-square satus-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);
    }

    // console.log(repos);
    // console.log(searchTerm);
}

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // console.log(data);
                displayRepos(data.items,language);
            })
        } else {
            alert("Error: GitHub User Not Found");
        }
    });;
};

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");

    // console.log(language);
    if (language) {
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";

    }
};

userFormEl.addEventListener("submit", formSubmitHandler);

languageButtonsEl.addEventListener("click", buttonClickHandler);

// getUserRepos("nickless192");
// console.log(getUserRepos);