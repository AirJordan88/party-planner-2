// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "2506-FTB-CT-WEB-PT";
const RESOURCE = "/events";
const API = `${BASE}/${COHORT}${RESOURCE}`;

// === State ===
let events = [];
let selectedEvent = null;

// === API Functions ===
async function getEvents() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    events = result.data;
    render();
  } catch (err) {
    console.error("Failed to fetch events:", err);
  }
}

async function getEvent(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    const result = await response.json();
    selectedEvent = result.data;
    render();
  } catch (err) {
    console.error("Failed to fetch event:", err);
  }
}

// === Components ===
function EventListItem(event) {
  const $li = document.createElement("li");
  $li.innerHTML = `<a href="#selected">${event.name}</a>`;
  $li.addEventListener("click", () => getEvent(event.id));
  return $li;
}

function EventList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("event-list");
  const $items = events.map(EventListItem);
  $ul.replaceChildren(...$items);
  return $ul;
}

function EventDetails() {
  const $section = document.createElement("section");
  $section.classList.add("event-details");

  if (!selectedEvent) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to see the details.";
    $section.appendChild($p);
    return $section;
  }

  const attendees = Array.isArray(selectedEvent.attendees)
    ? selectedEvent.attendees.map(att => `<li>${att.name || att}</li>`).join("")
    : "<li>No attendees listed</li>";

  $section.innerHTML = `
    <h3>${selectedEvent.name} #${selectedEvent.id}</h3>
    <p><strong>Date:</strong> ${selectedEvent.date}</p>
    <p><strong>Location:</strong> ${selectedEvent.location}</p>
    <p>${selectedEvent.description}</p>
    <h4>Attendees:</h4>
    <ul>${attendees}</ul>
  `;
  return $section;
}


// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <div id="event-list"></div>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <div id="event-details"></div>
      </section>
    </main>
  `;

  document.querySelector("#event-list").replaceWith(EventList());
  document.querySelector("#event-details").replaceWith(EventDetails());
}


// === Init ===
getEvents();
