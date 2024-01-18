let searchInputEl = document.getElementById("search");
let searchBtnEl = document.getElementById("searchBtn");
let spinnerEl = document.getElementById("spinner");
let searchResultContainer = document.getElementById("searchResult");
let userImageEl = document.getElementById("userImage");
let userContainerEl = document.getElementById("userContainer");
let userNameEl = document.getElementById("userName");
let repoSearchBtn = document.getElementById("repoSearchBtn");
let repoSpinner = document.getElementById("repoSpinner");
let repoSearchEl = document.getElementById("repoSearch");
let reposContainerEl = document.getElementById("reposContainer");
let itemsPerPage = 10;
let currentPage = 1;
let totalPages;
let paginationContainer = document.createElement("pagination");
let itemsPerPageContainer = document.createElement("div");
let bioEl = document.getElementById("bio");
let locationEl = document.getElementById("location");
let twitterEl = document.getElementById("twitter");
let githubEL = document.getElementById("githubLink");
const itemsPerPageArr = [10, 25, 50, 100];

const displayNoUserFound = (imgSrc, message) => {
  if (searchResultContainer) {
    searchResultContainer.innerHTML = "";
  }
  let imgEl = document.createElement("img");
  imgEl.src = imgSrc;
  imgEl.classList.add("w-50");
  let pEl = document.createElement("p");
  pEl.textContent = message;
  searchResultContainer.appendChild(imgEl);
  searchResultContainer.appendChild(pEl);
};

const displayNoRepoFound = (imgSrc, message) => {
  if (reposContainerEl) {
    reposContainerEl.innerHTML = "";
  }
  if (itemsPerPageContainer) {
    itemsPerPageContainer.innerHTML = "";
  }
  let imgEl = document.createElement("img");
  imgEl.src = imgSrc;
  imgEl.classList.add("w-50");
  let pEl = document.createElement("p");
  pEl.textContent = message;
  reposContainerEl.classList.add("flex-column");
  reposContainerEl.appendChild(imgEl);
  reposContainerEl.appendChild(pEl);
  searchResultContainer.classList.add("d-flex");
  searchResultContainer.classList.add("justify-content-center");
  searchResultContainer.appendChild(reposContainerEl);
};

const displayUserDetails = (userDetailsData) => {
  searchResultContainer.innerHTML = "";
  userContainerEl.classList.remove("d-none");
  userImageEl.src = userDetailsData.avatar_url;
  userNameEl.textContent = userDetailsData.name
    ? userDetailsData.name
    : userDetailsData.login;
  bioEl.textContent = userDetailsData.bio
    ? userDetailsData.bio
    : "Bio not available";
  locationEl.textContent = userDetailsData.location
    ? userDetailsData.location
    : "Location not available";
  twitterEl.textContent = userDetailsData.twitter_username
    ? userDetailsData.twitter_username
    : "Twitter account not available";
  githubEL.href = userDetailsData.html_url;
  searchResultContainer.appendChild(userContainerEl);
};

const renderItemsPerPage = () => {
  itemsPerPageContainer.innerHTML = "";
  let labelEl = document.createElement("label");
  labelEl.setAttribute("htmlFor", "selectItemsPerPage");
  labelEl.textContent = "Items per page :";
  labelEl.classList.add("w-50");
  labelEl.classList.add("mb-4");
  let selectEl = document.createElement("select");
  selectEl.setAttribute("id", "selectItemsPerPage");
  selectEl.classList.add("form-control");
  selectEl.classList.add("w-50");
  selectEl.classList.add("mb-4");
  for (let i of itemsPerPageArr) {
    let optionEl = document.createElement("option");
    optionEl.textContent = i;
    optionEl.setAttribute("value", i);
    selectEl.appendChild(optionEl);
  }
  selectEl.value = itemsPerPage;
  selectEl.addEventListener("change", (event) => {
    itemsPerPage = event.target.value;
    fetchSearchedRepo();
  });
  itemsPerPageContainer.appendChild(labelEl);
  itemsPerPageContainer.appendChild(selectEl);
  itemsPerPageContainer.classList.add("my-3");
  itemsPerPageContainer.classList.add("d-flex");
  itemsPerPageContainer.classList.add("align-items-center");
  itemsPerPageContainer.classList.add("justify-content-center");
  itemsPerPageContainer.classList.add("mb-5");
  searchResultContainer.appendChild(itemsPerPageContainer);
};

const displayUserRepos = (reposData) => {
  if (reposData.length !== 0) {
    reposContainerEl.innerHTML = "";

    reposContainerEl.classList.remove("flex-column");
    reposContainerEl.classList.add("repo-container");

    reposData.forEach((repo) => {
      let repoName = document.createElement("a");
      repoName.textContent = repo.name;
      repoName.href = repo.svn_url;
      repoName.target = "_blank";
      repoName.classList.add("repo-name");
      let repoDesc = document.createElement("p");
      repoDesc.textContent = repoDesc.description
        ? repoDesc.description
        : "No Description available";
      let listItem = document.createElement("li");
      listItem.appendChild(repoName);
      listItem.appendChild(repoDesc);
      listItem.classList.add("repo-item");
      if (repo.topics.length !== 0) {
        let topicsContainer = document.createElement("ul");
        topicsContainer.classList.add("topic-container");
        repo.topics.forEach((topic) => {
          let topicItem = document.createElement("li");
          topicItem.textContent = topic;
          topicItem.classList.add("topic-item");
          topicsContainer.appendChild(topicItem);
        });
        listItem.appendChild(topicsContainer);
      }
      reposContainerEl.appendChild(listItem);
    });
    searchResultContainer.appendChild(reposContainerEl);
    renderPagination();
    renderItemsPerPage();
  } else {
    paginationContainer.innerHTML = "";
    displayNoRepoFound(
      "https://i.pinimg.com/originals/48/fb/90/48fb90bcf2a1f779ee66deee8a12c898.png",
      "No Repositories found"
    );
  }
};

const fetchUser = async () => {
  if (searchInputEl.value.trim() !== "") {
    spinnerEl.classList.remove("d-none");

    if (reposContainerEl) {
      reposContainerEl.innerHTML = "";
    }
    repoSearchEl.value = "";
    if (paginationContainer) {
      paginationContainer.innerHTML = "";
    }
    if (itemsPerPageContainer) {
      itemsPerPageContainer.innerHTML = "";
    }
    try {
      const userDetailsResposne = await fetch(
        `https://api.github.com/users/${searchInputEl.value}`,
        {
          headers: {
            Authorization: "Bearer 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",
          },
        }
      );

      if (userDetailsResposne.status === 200) {
        const userDetailsData = await userDetailsResposne.json();
        spinnerEl.classList.add("d-none");
        displayUserDetails(userDetailsData);
        fetchSearchedRepo();
      } else {
        spinnerEl.classList.add("d-none");
        displayNoUserFound(
          "https://cdn1.iconfinder.com/data/icons/akura-empty-state-illustration/512/No_User_Found-512.png",
          "No User found. Please try with different username"
        );
      }
    } catch (err) {
      spinnerEl.classList.add("d-none");
      alert(err);
    }
  } else {
    alert("Please enter the username");
  }
};

const renderPagination = () => {
  paginationContainer.innerHTML = "";
  let previousPageItem = document.createElement("li");
  let previousAnchorEl = document.createElement("a");
  previousAnchorEl.classList.add("page-link");
  previousAnchorEl.textContent = "<<";
  currentPage !== 1 && previousAnchorEl.setAttribute("href", "#");
  previousPageItem.classList.add("page-item");
  previousPageItem.appendChild(previousAnchorEl);
  currentPage === 1 && previousPageItem.classList.add("disabled");
  previousPageItem.addEventListener("click", () => {
    if (currentPage !== 1) {
      currentPage = currentPage - 1;
      fetchSearchedRepo(false);
    }
  });
  paginationContainer.appendChild(previousPageItem);
  for (let i = 1; i <= totalPages; i++) {
    let pageItem = document.createElement("li");
    let anchorEl = document.createElement("a");
    anchorEl.textContent = i;
    anchorEl.classList.add("page-link");
    anchorEl.href = "#";
    pageItem.appendChild(anchorEl);
    paginationContainer.classList.add("pagination");
    pageItem.classList.add("page-item");
    currentPage === i && pageItem.classList.add("active");
    pageItem.addEventListener("click", () => {
      currentPage = i;
      fetchSearchedRepo(false);
    });
    paginationContainer.appendChild(pageItem);
  }
  let nextPageItem = document.createElement("li");
  let nextAnchorEl = document.createElement("a");
  nextAnchorEl.classList.add("page-link");
  nextAnchorEl.textContent = ">>";
  currentPage !== totalPages && nextAnchorEl.setAttribute("href", "#");
  nextPageItem.classList.add("page-item");
  nextPageItem.appendChild(nextAnchorEl);
  currentPage === totalPages && nextPageItem.classList.add("disabled");
  nextPageItem.addEventListener("click", () => {
    if (currentPage !== totalPages) {
      currentPage = currentPage + 1;
      fetchSearchedRepo(false);
    }
  });
  paginationContainer.classList.add("flex-wrap");
  paginationContainer.appendChild(nextPageItem);
  searchResultContainer.appendChild(paginationContainer);
};

const fetchSearchedRepo = async (setCurrentPageToOne = true) => {
  if (searchInputEl.value.trim() !== "") {
    repoSpinner.classList.remove("d-none");
    if (setCurrentPageToOne) {
      currentPage = 1;
    }
    try {
      const filteredRepoResponse = await fetch(
        `https://api.github.com/search/repositories?q=${repoSearchEl.value}+user:${searchInputEl.value}&per_page=${itemsPerPage}&page=${currentPage}`,
        {
          headers: {
            Authorization: "Bearer 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",
          },
        }
      );
      if (filteredRepoResponse.status === 200) {
        const filteredRepoData = await filteredRepoResponse.json();
        totalPages = Math.ceil(filteredRepoData.total_count / itemsPerPage);
        repoSpinner.classList.add("d-none");
        displayUserRepos(filteredRepoData.items);
      } else {
        repoSpinner.classList.add("d-none");
        displayNoRepoFound(
          "https://i.pinimg.com/originals/48/fb/90/48fb90bcf2a1f779ee66deee8a12c898.png",
          "No Repositories found"
        );
      }
    } catch (err) {
      alert(err);
      repoSpinner.classList.add("d-none");
    }
  } else {
    alert("Please enter the username");
  }
};

searchBtnEl.addEventListener("click", fetchUser);
repoSearchBtn.addEventListener("click", fetchSearchedRepo);
