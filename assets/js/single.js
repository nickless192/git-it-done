var issueContainerEl = document.getElementById("issues-container");
var limitWarningEl = document.getElementById("limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // console.log(data);
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("link")) {
                    // console.log("repo has more than 30 issues");
                    displayWarning(repo);
                }
            });
        }
        else {
            // alert("There was a problem with your request!");
            document.location.replace("./index.html");
        }
    })
    // console.log(repo);
};


var getRepoName = function() {
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    if (repoName) {
        getRepoIssues(repoName);
        repoNameEl.textContent = repoName;
    } else {
        document.location.replace("./index.html");
    }

};

var displayIssues = function(issues) {

    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issie is an actual issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        // apped to issues container
        issueContainerEl.appendChild(issueEl);
    }

};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "visit Github.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // apend to warning container
    limitWarningEl.appendChild(linkEl);
};

// getRepoIssues("facebook/react");
// getRepoIssues("nickless192/git-it-done");
getRepoName();