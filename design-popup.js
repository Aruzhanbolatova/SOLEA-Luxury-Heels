const contactDialog = document.getElementById("contactDialog");
const openContact = document.getElementById("openContact");
const closeContact = document.getElementById("closeContact");
const stylistForm = document.getElementById("stylistForm");
const contactStatus = document.getElementById("contactStatus");

// Open the popup.
openContact.addEventListener("click", function () {
  contactStatus.textContent = "";
  contactDialog.showModal();
});

// Close with the close button.
closeContact.addEventListener("click", function () {
  contactDialog.close();
});

// Close when clicking outside the popup.
contactDialog.addEventListener("click", function (event) {
  const bounds = contactDialog.getBoundingClientRect();

  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (event.target === contactDialog && clickedOutside) {
    contactDialog.close();
  }
});

// Preview only: no message is sent.
stylistForm.addEventListener("submit", function (event) {
  event.preventDefault();

  contactStatus.textContent =
    "Your details are valid. This is a demo; no message has been sent.";
});