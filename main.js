const handleSubmit = async (e) => {
  e.preventDefault();
  const inputValue = document.querySelector(".search-input").value;
  const searchQuery = inputValue.trim();
  const searchResult = document.querySelector(".search-result");
  searchResult.innerHTML = "";

  const spinner = document.querySelector(".spinner");
  spinner.classList.remove("hidden");

  try {
    const results = await searchWikipedia(searchQuery);
    if (results.query.searchinfo.totalhits === 0) {
      alert("No results found, try something different");
      return;
    }
    displayResult(results);
  } catch (error) {
    console.log(error);
    alert("failed to search wikipedia");
  } finally {
    spinner.classList.add("hidden");
  }
};

const searchWikipedia = async (searchQuery) => {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const data = await response.json();
  return data;
};

const displayResult = (result) => {
  const searchResult = document.querySelector(".search-result");
  result.query.search.forEach((result) => {
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

    searchResult.insertAdjacentHTML(
      "beforeend",
      `<div class="result-item">
        <h3 class="result-title">
          <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
        </h3>
        <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
        <span class="result-snippet">${result.snippet}</span><br>
      </div>`
    );
  });
};

const form = document.querySelector(".search-form");
form.addEventListener("submit", handleSubmit);
