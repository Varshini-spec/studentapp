// Selectors for calendar elements
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");

// Variables for calendar functionality
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let eventsArr = [];
getEvents(); // Retrieve events from localStorage
console.log(eventsArr);

// Function to handle swipe left (to navigate to index.html)
function handleSwipeLeft() {
  window.location.href = 'Todo/index.html'; // Adjust the path as per your folder structure
}

// Detect swipe gestures
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;                                                        
let yDown = null;

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    let xUp = evt.touches[0].clientX;                                    
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */
            handleSwipeLeft(); // Navigate to index.html on left swipe
        } else {
            /* right swipe */
            // You can handle right swipe action if needed
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */
        } else { 
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};

// Initialize calendar on page load
initCalendar();

// Function to initialize the calendar
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListener();
}

// Function to move to the previous month
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

// Function to move to the next month
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

// Event listeners for previous and next month buttons
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Function to add event listeners to each day in the calendar
function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      days.forEach((day) => {
        day.classList.remove("active");
      });
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

// Event listener for Today button
todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

// Event listener for input in dateInput field
dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

// Event listener for Go to Date button
gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

// Function to get active day details (day name and date) and update eventDay and eventDate elements
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

// Function to update events based on the selected day
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  eventsContainer.innerHTML = events;
  addEventCancelListener(); // Add event listener for cancelling events
}

// Add event listeners to events for cancelling
function addEventCancelListener() {
  const eventElements = document.querySelectorAll('.event');
  eventElements.forEach(eventElement => {
    eventElement.addEventListener('click', (e) => {
      const eventTitle = eventElement.querySelector('.event-title').innerHTML;
      eventsArr.forEach((event, eventIndex) => {
        if (
          activeDay === event.day &&
          month + 1 === event.month &&
          year === event.year
        ) {
          event.events.forEach((e, eventObjIndex) => {
            if (e.title === eventTitle) {
              event.events.splice(eventObjIndex, 1);
              if (event.events.length === 0) {
                eventsArr.splice(eventIndex, 1);
              }
              updateEvents(activeDay);
              saveEvents(); // Save events to local storage after deleting
            }
          });
        }
      });
    });
  });
}

// Event listener to toggle Add Event form visibility
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.add("active");
});

// Event listener to close Add Event form
addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

// Event listener to close Add Event form if clicked outside of it
document.addEventListener("click", (e) => {
  if (!addEventBtn.contains(e.target) && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

// Event listener for input in event title (limiting to 60 characters)
addEventTitle.addEventListener("input", (e) => {
  if (e.target.value.length > 60) {
    e.target.value = e.target.value.slice(0, 60);
  }
});

// Event listener for input in event time from field (formatting to HH:MM)
addEventFrom.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9:]/g, "");
  if (e.target.value.length === 2) {
    e.target.value += ":";
  }
  if (e.target.value.length > 5) {
    e.target.value = e.target.value.slice(0, 5);
  }
});

// Event listener for input in event time to field (formatting to HH:MM)
addEventTo.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9:]/g, "");
  if (e.target.value.length === 2) {
    e.target.value += ":";
  }
  if (e.target.value.length > 5) {
    e.target.value = e.target.value.slice(0, 5);
  }
});

// Event listener for Add Event submit button
addEventSubmit.addEventListener("click", () => {
  const title = addEventTitle.value.trim();
  const from = addEventFrom.value.trim();
  const to = addEventTo.value.trim();
  if (title !== "" && from !== "" && to !== "") {
    const eventObj = {
      day: activeDay,
      month: month + 1,
      year: year,
      events: [
        {
          title: title,
          time: from + " - " + to,
        },
      ],
    };
    let duplicateEvent = false;
    eventsArr.forEach((event) => {
      if (
        event.day === eventObj.day &&
        event.month === eventObj.month &&
        event.year === eventObj.year
      ) {
        event.events.forEach((e) => {
          if (
            e.title === eventObj.events[0].title &&
            e.time === eventObj.events[0].time
          ) {
            duplicateEvent = true;
          }
        });
        if (!duplicateEvent) {
          event.events.push(eventObj.events[0]);
          updateEvents(activeDay);
          addEventTitle.value = "";
          addEventFrom.value = "";
          addEventTo.value = "";
          addEventWrapper.classList.remove("active");
          saveEvents(); // Save events to local storage after adding
        } else {
          alert("Event already exists!");
        }
      }
    });
    if (eventsArr.length === 0 || !duplicateEvent) {
      eventsArr.push(eventObj);
      updateEvents(activeDay);
      addEventTitle.value = "";
      addEventFrom.value = "";
      addEventTo.value = "";
      addEventWrapper.classList.remove("active");
      saveEvents(); // Save events to local storage after adding
    }
  } else {
    alert("Please fill out all fields.");
  }
});

// Event listener to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-circle")) {
    const eventTitle = e.target.nextElementSibling.innerHTML;
    eventsArr.forEach((event) => {
      if (
        activeDay === event.day &&
        month + 1 === event.month &&
        year === event.year
      ) {
        event.events.forEach((e, i) => {
          if (e.title === eventTitle) {
            event.events.splice(i, 1);
            updateEvents(activeDay);
            saveEvents(); // Save events to local storage after deleting
          }
        });
      }
    });
  }
});

// Function to save events to local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

// Function to retrieve events from local storage
function getEvents() {
  const events = JSON.parse(localStorage.getItem("events"));
  if (events !== null) {
    eventsArr = events;
  }
}

// Function to convert time to 12-hour format
function convertTime(time) {
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);
  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}
