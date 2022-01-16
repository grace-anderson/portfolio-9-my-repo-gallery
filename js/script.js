//GLOBAL VARIABLES
//div where profile information will appear
const overviewElement = document.querySelector(".overview");
const username = "grace-anderson";
const repoList = document.querySelector(".repo-list");
const repoSection = document.querySelector(".repos");
const repoDataSection = document.querySelector(".repo-data");
const backToRepoButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos"); //variable to select input with "Search by name" placeholder
const body = document.querySelectorAll

//FETCH API JSON DATA
const fetchGitHubProfile = async function () {
    const request = await fetch (`https://api.github.com/users/${username}`);
    const userData = await request.json();
    //console.log(userData); //console log all data pulled from api
    displayUserInfo(userData);
};

fetchGitHubProfile();

//Display user information
const displayUserInfo = function (userData) {
  //create a new div and give it a class of “user-info”. 
  const userInfo = document.createElement("div");
  userInfo.classList.add("user-info");
   userInfo.innerHTML = 
        `<figure>
        <img alt="user avatar" src=${userData.avatar_url}/>
        </figure>
        <div>
            <p><strong>Name:</strong> ${userData.name}</p>
            <p><strong>Bio:</strong> ${userData.bio}</p>
            <p><strong>Location:</strong> ${userData.location}</p>
            <p><strong>Number of public repos:</strong> ${userData.public_repos}</p>
        </div>`;
    overviewElement.append(userInfo);
    fetchRepos();
};

//Fetch public repo info
const fetchRepos = async function () {
    const repoRequest = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repos = await repoRequest.json();
    //console.log(repos); //console log repos pulled from api
    displayRepoInfo(repos);
};

//Display name of each public repo
const displayRepoInfo = function (repos) {
    filterInput.classList.remove("hide");
    for (const r of repos) {
        const li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3>${r.name}</h3>`;
        repoList.append(li);
    }
};

repoList.addEventListener("click", function(e) {
    if (e.target.matches("h3")){
        const repoName = e.target.innerText;
        getSpecificRepoInfo(repoName);
    }
});

const getSpecificRepoInfo = async function (repoName) {
    const specificRequest = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await specificRequest.json();
    const fetchLanguages = await fetch (`https://api.github.com/repos/${username}/${repoName}/languages`);
    const languageData = await fetchLanguages.json();
    //console.log(languageData);
    const languages = [];
    for (let key in languageData) {
        //console.log(key);
        languages.push(key);
    }
    //console.log(languages);
    displaySpecificRepoInfo(repoInfo, languages);
};

const displaySpecificRepoInfo = async function(repoInfo, languages) {
    repoDataSection.innerHTML = "";
    repoDataSection.innerHTML = 
        `<div>
        <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
        </div>`
    repoDataSection.classList.remove("hide");
    repoSection.classList.add("hide");
    backToRepoButton.classList.remove("hide");
}

backToRepoButton.addEventListener("click", function() {
    repoSection.classList.remove("hide");
    repoDataSection.classList.add("hide");
    backToRepoButton.classList.add("hide");
});

filterInput.addEventListener("input", function(e){
    const captureInput = e.target.value;
    const allRepos = document.querySelectorAll(".repo");
    const searchLowerCase = captureInput.toLowerCase();
    for (const repo of allRepos) {
        const repoLowerCase = repo.innerText.toLowerCase();
        if (repoLowerCase.includes(searchLowerCase)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});
