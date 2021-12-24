let searchFilter = document.querySelector(".search-filter");
let selectFilter = document.querySelector("select");

let resultsNodeList = document.querySelectorAll(".deGenSelector");

selectFilter.addEventListener("change", (event) => {
  for (let i = 0; i < resultsNodeList.length; i++) {
    if (resultsNodeList[i].classList.contains(event.target.value)) {
      resultsNodeList[i].classList.remove("hidden");
    } else if (event.target.value == "Sort by...") {
      resultsNodeList[i].classList.remove("hidden");
    } else {
      resultsNodeList[i].classList.add("hidden");
    }
  }
});

let shopContentNodeList = document.querySelectorAll(".deGenSelector");

searchFilter.addEventListener("keyup", (event) => {
  for (let i = 0; i < resultsNodeList.length; i++) {
    if (shopContentNodeList[i].textContent.toUpperCase().includes(event.target.value.toUpperCase())) {
      resultsNodeList[i].classList.remove("hidden");
    } else {
      resultsNodeList[i].classList.add("hidden");
    }
  }
});
