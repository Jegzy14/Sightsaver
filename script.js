const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a") && window.matchMedia("(max-width: 760px)").matches) {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
});

const searchInput = document.querySelector("#resource-search");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const resourceCards = [...document.querySelectorAll(".resource-card")];
const resultMessage = document.querySelector("#resource-results");
const emptyState = document.querySelector("#empty-resources");
let activeCategory = "all";

function updateResources() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  resourceCards.forEach((card) => {
    const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase();
    const matchesSearch = !query || searchableText.includes(query);
    const isVisible = matchesCategory && matchesSearch;
    card.hidden = !isVisible;
    visibleCount += Number(isVisible);
  });

  resultMessage.textContent = `Showing ${visibleCount} sample ${visibleCount === 1 ? "resource" : "resources"}`;
  emptyState.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", updateResources);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;
    filterButtons.forEach((filter) => {
      const isSelected = filter === button;
      filter.classList.toggle("is-selected", isSelected);
      filter.setAttribute("aria-pressed", String(isSelected));
    });
    updateResources();
  });
});

document.querySelector(".reset-filters").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "all";
  filterButtons.forEach((button) => {
    const isSelected = button.dataset.filter === "all";
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  updateResources();
  searchInput.focus();
});

const eventDialog = document.querySelector("#event-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogCloseButtons = eventDialog.querySelectorAll(".dialog-close, .dialog-done");
let lastEventTrigger;

document.querySelectorAll(".event-action").forEach((button) => {
  button.addEventListener("click", () => {
    lastEventTrigger = button;
    dialogTitle.textContent = button.dataset.eventTitle;
    dialogDescription.textContent = button.dataset.eventDescription;
    eventDialog.showModal();
    eventDialog.querySelector(".dialog-close").focus();
  });
});

dialogCloseButtons.forEach((button) => {
  button.addEventListener("click", () => eventDialog.close());
});

eventDialog.addEventListener("close", () => lastEventTrigger?.focus());
eventDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    eventDialog.close();
  }
});
eventDialog.addEventListener("click", (event) => {
  if (event.target === eventDialog) eventDialog.close();
});

const enquiryForm = document.querySelector("#enquiry-form");
const formFeedback = document.querySelector("#form-feedback");

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  const name = enquiryForm.elements.name.value.trim();
  formFeedback.textContent = `Thanks, ${name}. This prototype has not sent or saved your enquiry. No follow-up will be made.`;
});
