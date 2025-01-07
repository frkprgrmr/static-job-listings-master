const listContainer = document.querySelector("ul");
const filterBoxWrapper = document.querySelector(".filter");
const filterBox = document.querySelector(".filter-value");

// Fetch and display job listings
async function getData() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    renderJobs(data);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function renderJobs(data) {
  listContainer.innerHTML = ""; // Clear existing content
  data.forEach((job) => {
    const jobElement = document.createElement("li");
    jobElement.id = `job-${job.id}`;
    jobElement.className = "job";

    const skillsHTML = [...job.languages, ...job.tools]
      .map((skill) => `<button class="skills">${skill}</button>`)
      .join("");

    jobElement.innerHTML = `
      <div class="developer-details">
        <img src="${job.logo}" alt="${job.company} logo" class="avatar" />
        <div>
          <div class="company-wrap">
            <h1 class="company">${job.company}</h1>
            ${job.new ? '<span class="new">New!</span>' : ""}
            ${job.featured ? '<span class="featured">Featured</span>' : ""}
          </div>
          <div class="position-wrap">
            <h2 class="position">${job.position}</h2>
          </div>
          <div class="contract-wrap">
            <span>${job.postedAt}</span>
            <span class="contract">${job.contract}</span>
            <span>${job.location}</span>
          </div>
        </div>
      </div>
      <div class="developer-skills">${skillsHTML}</div>
    `;
    listContainer.appendChild(jobElement);
  });
}

// Add clicked skill to filter box
function pasteClickedSkill(event) {
  if (!event.target.matches(".skills")) return;

  const skillValue = event.target.textContent;
  if (
    Array.from(filterBox.children).some((el) => el.textContent === skillValue)
  )
    return;

  const filterItem = document.createElement("li");
  filterItem.innerHTML = `
    <span class="search">${skillValue}</span>
    <img src="./images/icon-remove.svg" alt="Remove" class="remove" />
  `;
  filterBox.appendChild(filterItem);
  filterBoxWrapper.style.display = "flex";

  filterJobList();
}

// Filter job listings
function filterJobList() {
  const filters = Array.from(filterBox.querySelectorAll(".search")).map(
    (el) => el.textContent
  );

  Array.from(listContainer.children).forEach((job) => {
    const jobSkills = Array.from(job.querySelectorAll(".skills")).map(
      (el) => el.textContent
    );
    const matches = filters.every((filter) => jobSkills.includes(filter));

    job.classList.toggle("filtered", !matches);
  });
}

// Remove a skill filter
function removeSearchedSkill(event) {
  if (!event.target.matches(".remove")) return;

  const filterItem = event.target.closest("li");
  filterItem.remove();

  if (!filterBox.hasChildNodes()) {
    filterBoxWrapper.style.display = "none";
    Array.from(listContainer.children).forEach((job) =>
      job.classList.remove("filtered")
    );
  } else {
    filterJobList();
  }
}

// Clear all filters
function clearFilters() {
  filterBox.innerHTML = "";
  filterBoxWrapper.style.display = "none";
  Array.from(listContainer.children).forEach((job) =>
    job.classList.remove("filtered")
  );
}

// Event Listeners
listContainer.addEventListener("click", pasteClickedSkill);
filterBoxWrapper.addEventListener("click", removeSearchedSkill);
document.querySelector(".clear").addEventListener("click", clearFilters);

// Initial Load
getData();
