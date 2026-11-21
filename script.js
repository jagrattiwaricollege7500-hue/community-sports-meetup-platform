// ===== 1. Join / Leave buttons =====
var cards = document.querySelectorAll(".event");

// Updates the seats text, progress bar and button of one card
function updateCard(card) {
  var taken = Number(card.dataset.taken);
  var max = Number(card.dataset.max);
  var waitlist = Number(card.dataset.waitlist);
  var joined = card.classList.contains("joined");
  var text = card.querySelector(".seats");
  var button = card.querySelector(".join-btn");
  var bar = card.querySelector("progress");

  if (taken >= max) {
    // full event: joining means joining the waitlist
    if (joined) {
      text.textContent = "You are #" + (waitlist + 1) + " on the waitlist.";
      button.textContent = "Leave waitlist";
    } else {
      text.textContent = taken + " of " + max + " seats taken - " + waitlist + " on waitlist";
      button.textContent = "Join waitlist";
    }
  } else {
    // joining takes one seat
    var count = joined ? taken + 1 : taken;
    bar.value = count;
    card.querySelector(".left").textContent = (max - count) + " seats left";
    text.textContent = count + " of " + max + " seats taken - " + (max - count) + " left";
    button.textContent = joined ? "Leave event" : "Join event";
  }
}

// Shows or hides the reminder of an event
function updateReminder(card) {
  var number = card.id.replace("event", "");          // "event3" -> "3"
  document.getElementById("reminder" + number).hidden = !card.classList.contains("joined");
  document.getElementById("empty-message").hidden = document.querySelectorAll(".event.joined").length > 0;
}

cards.forEach(function (card) {
  card.querySelector(".join-btn").addEventListener("click", function () {
    card.classList.toggle("joined");
    updateCard(card);
    updateReminder(card);
  });
});


// ===== 2. Age group filter =====
var filterMessage = document.getElementById("filter-message");

function filterEvents() {
  var group = document.querySelector("input[name='age-group']:checked").value;

  cards.forEach(function (card) {
    // data-ages looks like "teen adult"
    card.hidden = group !== "all" && !card.dataset.ages.includes(group);
  });
  filterMessage.textContent = group === "all" ? "" : "Showing events recommended for your age group.";
}

document.querySelectorAll("input[name='age-group']").forEach(function (radio) {
  radio.addEventListener("change", filterEvents);
});


// ===== 3. Profile form: pick the age group from the age =====
document.getElementById("profile-form").addEventListener("submit", function (e) {
  e.preventDefault();                                  // stops the page reloading
  var age = Number(document.getElementById("age-input").value);
  var group = "all";

  if (age >= 40) group = "senior";
  else if (age >= 18) group = "adult";
  else if (age >= 13) group = "teen";

  document.querySelector("input[name='age-group'][value='" + group + "']").checked = true;
  filterEvents();
  document.getElementById("events").scrollIntoView();
});


// ===== 4. Organizer section =====
document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("create-message").textContent = "Event published (demo only).";
  this.reset();
});

document.querySelectorAll(".remove-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    button.closest("tr").remove();
  });
});

document.querySelector(".confirm-btn").addEventListener("click", function () {
  var row = this.closest("tr");
  row.querySelector(".status").textContent = "Confirmed";
  this.remove();
});


// ===== 5. Hero photo slideshow (new photo every 5 seconds) =====
var slides = document.querySelectorAll(".hero-slide");
var current = 0;

setInterval(function () {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;             // after the last photo, go back to 0
  slides[current].classList.add("active");
}, 5000);


// ===== 6. Sliding report bar: copy the items once so it loops without a gap =====
var track = document.getElementById("ticker-track");
track.innerHTML = track.innerHTML + track.innerHTML;


// ===== 7. Organizer login (demo only: a real site would check on a server) =====
var loginForm = document.getElementById("login-form");
var organizerPanel = document.getElementById("organizer-panel");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var user = document.getElementById("login-user").value;
  var pass = document.getElementById("login-pass").value;

  if (user === "organizer" && pass === "play123") {
    loginForm.hidden = true;          // hide the login box
    organizerPanel.hidden = false;    // show the organizer tools
  } else {
    document.getElementById("login-message").textContent = "Wrong username or password. Try again.";
  }
});

document.getElementById("logout-btn").addEventListener("click", function () {
  organizerPanel.hidden = true;
  loginForm.hidden = false;
  loginForm.reset();
  document.getElementById("login-message").textContent = "";
});


// ===== 8. Contact form =====
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("contact-message").textContent = "Thank you! We have received your message.";
  this.reset();
});
