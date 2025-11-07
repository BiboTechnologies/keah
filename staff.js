import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref,remove, push,get, onValue,child,set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged,sendPasswordResetEmail , signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyDNZkzGQhDSQLd9QNfQxbfsMZ3bIXmQ3bI",
  authDomain: "keah-f80f4.firebaseapp.com",
  databaseURL: "https://keah-f80f4-default-rtdb.firebaseio.com",
  projectId: "keah-f80f4",
  storageBucket: "keah-f80f4.firebasestorage.app",
  messagingSenderId: "577790763642",
  appId: "1:577790763642:web:3bc3de0ca2b407881451c3",
  measurementId: "G-ZQ2V7WH2X1"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app); // Initialize Firebase Authentication




     
// Ensure that authToken is defined in the global scope
let authToken;
let tokenExpiryTime;

// Function to generate a token valid for 24 hours
function generateToken() {
authToken = Math.random().toString(36).substring(2);
const currentTime = new Date();
const tokenExpiryTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // Token valid for 24 hours

// Store token and expiry time in local storage
localStorage.setItem('authToken', authToken);
localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());
}


// Function to retrieve token and its expiry time from local storage
function retrieveTokenFromLocalStorage() {
authToken = localStorage.getItem('authToken');
const storedExpiryTime = localStorage.getItem('tokenExpiryTime');
if (authToken && storedExpiryTime) {
  tokenExpiryTime = new Date(storedExpiryTime);
}
}

// Function to check if the token is still valid
function isTokenValid() {
const currentTime = new Date();
return tokenExpiryTime > currentTime;
}

window.addEventListener('load', function() {
  retrieveTokenFromLocalStorage(); // Retrieve token from local storage
  // Check if token is valid, if not, redirect to the login page
  if (!isTokenValid()) {
    window.location.href = 'login.html'; // Replace 'login.html' with the URL of your login page
  }
});


// Rest of your code...


// Disable right-click when the popup is displayed
document.addEventListener('contextmenu', function(event) {
if (document.getElementById('loginpopup').style.display === 'block') {
  event.preventDefault();
}
document.addEventListener('keydown', function(event) {
if (event.keyCode === 123) {
  event.preventDefault();
}
});

});
const allowedEmails = ['biboofficial256@gmail.com']; // Add the allowed email addresses here

// Show a loader inside the submit button when it's clicked
document.getElementById('loginForm').addEventListener('submit', function(event) {
event.preventDefault(); // Prevent default form submission

// Show loader inside the submit button
const submitBtn = document.getElementById('submitBtn');
submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting';

// Get user credentials from the form
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

// Update the login success block to generate a new token and store it
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  // Check if the user's email is allowed
  if (allowedEmails.includes(email)) {
    // Login successful, hide the login overlay and popup
    document.getElementById('loginoverlay').style.display = 'none';
    document.getElementById('loginpopup').style.display = 'none';
    generateToken(); // Generate a new token on successful login
    } else {
      // Login not allowed, show an error message
      const errorContainer = document.getElementById('errorContainer');
      errorContainer.textContent = 'Access denied. You are not authorized.';
      errorContainer.style.display = 'block'; // Show the message
      // Log out the user since they are not authorized
      signOut(auth)
        .then(() => {
          // Reset the submit button text after a short delay (e.g., 2 seconds)
          setTimeout(function() {
            submitBtn.innerHTML = 'Submit';
          }, 2000);
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    }
  })
  .catch((error) => {
    // Login failed, display error message
    const errorMessage = error.message;
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = errorMessage;
    errorContainer.style.display = 'block'; // Show the message

    // Reset the submit button text after a short delay (e.g., 2 seconds)
    setTimeout(function() {
      submitBtn.innerHTML = 'Submit';
    }, 2000);
  });
});



// Event listener for the "Forgot Password" link
document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
event.preventDefault();

// Get the email entered by the user
const email = document.getElementById('email').value;

// Use Firebase sendPasswordResetEmail method with auth object
sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent successfully
    showMessage(' A password reset email has been sent. Please check your inbox.');
  })
  .catch((error) => {
    // Password reset email failed to send
    const errorMessage = error.message;
    alert('Password reset email failed to send. ' + errorMessage);
  });
});
// Function to display a message with optional retry button and success flag
function displayMessage(title, message, isSuccess = false) {
// Clear existing messages
const existingMessages = document.querySelectorAll('.retry-message');
existingMessages.forEach(function (message) {
  message.remove();
});

// Create a div element for the message
const messageDiv = document.createElement('div');
messageDiv.classList.add('retry-message'); // Add the class for styling

// Set background color to green for success message
if (isSuccess) {
  messageDiv.style.backgroundColor = '#4caf50';
}

// Create close button element
const closeButton = document.createElement('button');
closeButton.classList.add('close-btn');
closeButton.innerHTML = '<i class="fa fa-times"></i>';
closeButton.addEventListener('click', function () {
  messageDiv.remove();
});

// Create title element
const titleElement = document.createElement('h2');
titleElement.textContent = title;

// Create message element
const messageElement = document.createElement('p');
messageElement.textContent = message;

// Append title, message, and close button to the message div
messageDiv.appendChild(titleElement);
messageDiv.appendChild(messageElement);
//messageDiv.appendChild(closeButton);

// Append the message div to the document body
document.body.appendChild(messageDiv);

// Automatically remove the message after 5 seconds (5000 milliseconds)
setTimeout(function () {
  messageDiv.remove();
}, 1500);
}
// Function to display user information
function displayUserInformation(user) {
// Set the h2 element text to the user's display name
const profileName = document.querySelector('.profile_info h2');
profileName.textContent = user.displayName;

// Set the profile image source to the user's profile photo URL
const profileImage = document.querySelector('.profile_pic img');
profileImage.src = user.photoURL;

// Set the profile image in the dropdown menu
const dropdownProfileImage = document.querySelector('.user-profile img');
dropdownProfileImage.src = user.photoURL;

// Display success message
displayMessage('', `Welcome, ${user.displayName}.`, true); // Pass true for success message

// Reload the page content or perform any necessary actions for an authenticated user
}

// Function to handle sign-in success
function handleSignInSuccess(user) {
// Display user information
displayUserInformation(user);
}

// Function to handle sign-in error
function handleSignInError(error) {
console.error('Error signing in:', error);
// Display access denied message
displayMessage('Access Denied. Please sign in with a valid email.');
}

// Function to sign in with Google
function signInWithGoogle() {
var provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
  .then(function (result) {
    const user = result.user;
    handleSignInSuccess(user);
  })
  .catch(function (error) {
    handleSignInError(error);
  });
}

// Display the email sign-in popup on page load
window.addEventListener('load', function() {
auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    displayUserInformation(user);
  } else {
    // User is not signed in, display the sign-in popup
    signInWithGoogle();
  }
});
});

// Function to retry the sign-in process
function retryCallback() {
signInWithGoogle();
}






displayMessage('Signing in...', 'Please wait...', false); // Pass false for error message

// Add event listener to all links within the website
document.addEventListener('click', function(event) {
  const target = event.target;

  // Check if the clicked element is a link within the website
  if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
    // Store the clicked link's URL in local storage
    localStorage.setItem('clickedLink', target.href);
  }
});

// Get the "Log Out" button element
const logoutButton = document.getElementById("logoutButton");
const overlay = document.getElementById("overlay");

// Add event listener to the "Log Out" button
logoutButton.addEventListener("click", function(event) {
  event.preventDefault();

  // Store the current page URL in local storage
  localStorage.setItem('logoutPage', window.location.href);

  // Store the clicked link's URL in local storage
  const clickedLink = localStorage.getItem('clickedLink');
  if (clickedLink) {
    localStorage.setItem('logoutPage', clickedLink);
  }

  // Display overlay with spinner and text
  displayOverlay();

  // Simulate logout delay (you can replace this with your actual logout logic)
  setTimeout(() => {
    // Perform logout
    logOut();

    // Hide overlay after logout is complete
    hideOverlay();
  }, 2000);
});

function displayOverlay() {
  // Create spinner element
  const spinner = document.createElement('div');
  spinner.id = 'loadingSpinner';
  overlay.appendChild(spinner);

  // Create "Logging Out" text element
  const loggingOutText = document.createElement('div');
  loggingOutText.id = 'loggingOutText';
  loggingOutText.textContent = 'Logging Out...';
  overlay.appendChild(loggingOutText);

  // Display overlay
  overlay.style.display = 'flex';
}

function hideOverlay() {
  // Remove spinner and text elements from overlay
  const spinner = document.getElementById('loadingSpinner');
  const loggingOutText = document.getElementById('loggingOutText');
  overlay.removeChild(spinner);
  overlay.removeChild(loggingOutText);

  // Hide overlay
  overlay.style.display = 'none';
}


// Function to log out
function logOut() {
  auth.signOut()
    .then(function() {
      // Clear the login token and other stored values
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiryTime');
      localStorage.removeItem('clickedLink');

      // Redirect to the stored page URL (either clicked link or current page)
      const logoutPage = localStorage.getItem('logoutPage') || 'login.html';
      window.location.href = logoutPage;
    })
    .catch(function(error) {
      console.error('Error signing out:', error);
    });
}



const form = document.querySelector('.popup-form');
const submitButton = document.querySelector('.popup-form button');
const successMessage = document.createElement('p');
successMessage.textContent = 'Staff details uploaded successfully!';
successMessage.style.color = 'green';
const errorMessage = document.createElement('p');
errorMessage.textContent = 'Error uploading Staff details. Please try again.';
errorMessage.style.color = 'red';
const patientsContainer = document.getElementById('patients');
let patients = []; // Declare patients variable outside the event listener


form.addEventListener('submit', function(e) {
e.preventDefault();

const name = document.getElementById('name').value;
const dob = document.getElementById('dob').value;
const parents = document.getElementById('parents').value;
const patientData = {
  name: name,
  dob: dob,
  parents: parents
};

const patientsRef = ref(database, 'staff');
const newPatientRef = child(patientsRef, name); // Use patient name as the key

set(newPatientRef, patientData)
  .then(() => {
    form.reset();
    form.appendChild(successMessage);
  })
  .catch(() => {
    form.appendChild(errorMessage);
  });
});

// Add event listener to search button
searchButton.addEventListener('click', () => {
const searchTerm = searchInput.value.trim(); // Get the search term

// Show the loader
loaderElement.classList.remove('hidden');

// Clear the patients container
patientsContainer.innerHTML = '';

// Search through Firebase for staff names and DOBs by key
const staffRef = ref(database, 'staff');
onValue(staffRef, (snapshot) => {
  const staffData = snapshot.val();
  const searchResults = [];

  if (staffData) {
    const staff = Object.entries(staffData);
    const addedKeys = new Set(); // Track added keys to avoid duplicates

    if (searchTerm !== '') {
      // Filter staff based on the search term
      staff.forEach(([key, person]) => {
        if (
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.dob.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          // Add staff member to search results if not already added
          if (!addedKeys.has(key)) {
            searchResults.push({ key, ...person });
            addedKeys.add(key);
          }
        }
      });
    } else {
      // Display all staff if the search term is empty
      staff.forEach(([key, person]) => {
        // Add staff member to search results if not already added
        if (!addedKeys.has(key)) {
          searchResults.push({ key, ...person });
          addedKeys.add(key);
        }
      });
    }
  }

  // Hide the loader
  loaderElement.classList.add('hidden');

  // Display search results
  if (searchResults.length > 0) {
    renderPatients(searchResults);
  } else {
    patientsContainer.innerHTML = '<p class="no-results">No staff found.</p>';
  }
});
});

  const sortSelect = document.getElementById('sortSelect');
const sortValue = sortSelect.value;

if (sortValue === 'expiry') {
  // Sort patients by expiry date in ascending order
  patients.sort((a, b) => new Date(a.dob) - new Date(b.dob));
} else if (sortValue === 'alphabetical') {
  // Sort patients by name in alphabetical order
  patients.sort((a, b) => a.name.localeCompare(b.name));
}
// Function to filter patients based on the search term
function filterPatients(patients, searchTerm) {
const filteredPatients = patients.filter((patient) => {
  const patientName = patient.name.toLowerCase();
  return patientName.includes(searchTerm.toLowerCase());
});
renderPatients(filteredPatients);
}

// Add event listener to search input for live search
searchInput.addEventListener('input', () => {
const searchTerm = searchInput.value.trim(); // Get the search term
const patientsRef = ref(database, 'staff');
onValue(patientsRef, (snapshot) => {
  const patientsData = snapshot.val();
  const patients = patientsData ? Object.values(patientsData) : [];
  filterPatients(patients, searchTerm);
});
});

function renderPatients(patients) {
// Clear the patients container
patientsContainer.innerHTML = '';

// Create the table element
const table = document.createElement('table');
table.classList.add('patients-table');

// Create the table headers
const headers = ['Name', 'Contact', 'Work Type (Job)', 'Actions'];
const headerRow = document.createElement('tr');
headers.forEach((headerText) => {
  const th = document.createElement('th');
  th.textContent = headerText;
  headerRow.appendChild(th);
});
table.appendChild(headerRow);

// Loop through the patients data and create rows for each patient
patients.forEach((patient) => {
  const row = document.createElement('tr');

  // Name
  const nameCell = document.createElement('td');
  nameCell.textContent = patient.name;
  row.appendChild(nameCell);

  // Contact
  const contactCell = document.createElement('td');
  contactCell.textContent = patient.parents;
  row.appendChild(contactCell);

  // Work Type (Job)
  const workTypeCell = document.createElement('td');
  workTypeCell.textContent = patient.dob;
  row.appendChild(workTypeCell);


const deletePatient = (patient) => {
// Prompt for password input
const password = prompt('Enter the password to delete the Staff:');

// Verify the password
// Replace 'password123' with your actual password validation logic
if (password !== 'mm') {
  alert('Invalid password. Patient deletion canceled.');
  return;
}

// Delete the patient from the database
const patientRef = ref(database, `staff/${patient.name}`);
remove(patientRef)
  .then(() => {
    // Handle success
    console.log('Staff deleted successfully.');

    // Display a success message
    alert(`Patient ${patient.name} deleted successfully.`);
  })
  .catch((error) => {
    // Handle error
    console.error('Error deleting patient:', error);

    // Display an error message
    alert(`Error deleting staff ${patient.name}. Please try again.`);
  });
};
  // Actions
  const actionsCell = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', function () {
    deletePatient(patient);
  });
  actionsCell.appendChild(deleteButton);

  const checkInButton = document.createElement('button');
  checkInButton.textContent = 'Check-In';
  checkInButton.classList.add('check-in-button');
checkInButton.addEventListener('click', function() {
const checkInTime = new Date();
const checkInData = {
  checkInTime: checkInTime.toLocaleTimeString(), // Convert time to a readable string
  checkInDate: checkInTime.toLocaleDateString() // Convert date to a readable string
};

const patientCheckin = document.getElementById('patientCheckin');

// Save the check-in data to Firebase
const patientRef = ref(database, `staff/${patient.name}/checkin`);
const checkInDate = checkInTime.toLocaleDateString().replaceAll('/', '-'); // Convert date to a string format
const checkInRef = child(patientRef, checkInDate); // Use the check-in date as the key

// Display the loader
const loader = document.getElementById('loader');
loader.style.display = 'block';

// Check if the check-in data for the current date exists
get(checkInRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      // Display an alert if check-in data already exists for the current date
      alert(` ${patient.name} has already checked in today.`);
      loader.style.display = 'none'; // Hide the loader
    } else {
      // Save the check-in data to Firebase
      set(checkInRef, checkInData)
        .then(() => {
          // Handle success
          console.log('Check-in data saved successfully:', checkInData);

          // Display the check-in details in the patientCheckin div
          const checkInDetails = document.createElement('p');
          checkInDetails.textContent = `Check-In Time: ${checkInData.checkInTime}, Check-In Date: ${checkInData.checkInDate}`;
          patientCheckin.appendChild(checkInDetails);

          // Display a check-in success message with the patient's name
          const checkInMessage = document.getElementById('checkInMessage');
          checkInMessage.textContent = ` ${patient.name} checked in successfully!`;
          checkInMessage.style.display = 'block';

          // Hide the loader
          loader.style.display = 'none';

          // Set a timeout to hide the check-in message after 3 seconds
          setTimeout(() => {
            checkInMessage.style.display = 'none';
          }, 3000);
        })
        .catch((error) => {
          // Handle error
          console.error('Error saving check-in data:', error);

          // Display an error message
          const checkInMessage = document.getElementById('checkInMessage');
          checkInMessage.textContent = `Error checking in  ${patient.name}. Please try again.`;
          checkInMessage.style.display = 'block';

          // Hide the loader
          loader.style.display = 'none';

          // Set a timeout to hide the check-in message after 3 seconds
          setTimeout(() => {
            checkInMessage.style.display = 'none';
          }, 3000);
        });
    }
  })
  .catch((error) => {
    // Handle error
    console.error('Error checking check-in data:', error);
  });
});

  actionsCell.appendChild(checkInButton);

// Create the check-out button
const checkOutButton = document.createElement('button');
checkOutButton.textContent = 'Check-Out';
checkOutButton.classList.add('check-out-button');
checkOutButton.addEventListener('click', function() {
const checkOutTime = new Date();
const checkOutData = {
  checkOutTime: checkOutTime.toLocaleTimeString(), // Convert time to a readable string
  checkOutDate: checkOutTime.toLocaleDateString() // Convert date to a readable string
};

// Check if the check-in data for the current date exists
const checkInDate = checkOutTime.toLocaleDateString().replaceAll('/', '-'); // Convert date to a string format
const patientCheckInRef = ref(database, `staff/${patient.name}/checkin/${checkInDate}`);
get(patientCheckInRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      // Check if check-out data already exists for the current date
      const checkOutRef = child(patientCheckInRef, 'checkOutTime');
      get(checkOutRef)
        .then((checkOutSnapshot) => {
          if (checkOutSnapshot.exists()) {
            // Display an alert if check-out data already exists for the current date
            alert(` ${patient.name} has already checked out today.`);
          } else {
            // Save the check-out data to Firebase
            set(checkOutRef, checkOutData.checkOutTime)
              .then(() => {
                // Handle success
                console.log('Check-out data saved successfully:', checkOutData);

                // Display the check-out details in the patientCheckin div
                const checkOutDetails = document.createElement('p');
                checkOutDetails.textContent = `Check-Out Time: ${checkOutData.checkOutTime}, Check-Out Date: ${checkOutData.checkOutDate}`;
                patientCheckin.appendChild(checkOutDetails);

                // Display a check-out success message with the patient's name
const checkOutMessage = document.getElementById('checkOutMessage');
checkOutMessage.textContent = ` ${patient.name} checked out successfully!`;
checkOutMessage.style.display = 'block';

// Hide the check-out button
checkOutButton.style.display = 'none';

// Set a timeout to hide the check-out message after 3 seconds
setTimeout(() => {
checkOutMessage.style.display = 'none';
}, 3000);

              })
              .catch((error) => {
                // Handle error
                console.error('Error saving check-out data:', error);

                // Display an error message
                const checkOutMessage = document.getElementById('checkOutMessage');
                checkOutMessage.textContent = `Error checking out ${patient.name}. Please try again.`;
                checkOutMessage.style.display = 'block';
                
              });
          }
        })
        .catch((error) => {
          // Handle error
          console.error('Error checking check-out data:', error);
        });
    } else {
      // Display an alert if there is no check-in data for the current date
      alert(`Cannot check out ${patient.name}. Please check in first.`);
    }
  })
  .catch((error) => {
    // Handle error
    console.error('Error checking check-in data:', error);
  });
});

// Append the check-out button to the patientCard
actionsCell.appendChild(checkOutButton);


  const viewButton = document.createElement('button');
  viewButton.textContent = 'View';
  viewButton.classList.add('view-button');
  viewButton.addEventListener('click', function () {
    currentPatientName = patient.name;
    openPatientHistoryPopup(patient);
  });
  actionsCell.appendChild(viewButton);

  row.appendChild(actionsCell);

  // Append the row to the table
  table.appendChild(row);
});

// Function to delete a patient
function deletePatient(patient) {
// Implement the logic to delete the patient from the database
console.log('Deleting patient:', patient.name);
}

// Function to handle check-in of a patient
function checkInPatient(patient) {
// Implement the logic to handle the check-in of the patient
console.log('Checking in patient:', patient.name);
}
// Append the table to the patients container
patientsContainer.appendChild(table);
}




// Define the addRecordForm and currentPatientName variables
const addRecordForm = document.getElementById('addRecordForm');
let currentPatientName = '';
function showMessage(message) {
const messageElement = document.getElementById('message');
messageElement.textContent = message;
messageElement.style.display = 'block';

// Hide the message after 4 seconds (4000 milliseconds)
setTimeout(() => {
  messageElement.style.display = 'none';
}, 4000);
}

// Call showMessage with an empty message to hide the message on page load
showMessage('');


// Attach the submit event listener outside the function
addRecordForm.addEventListener('submit', function (e) {
e.preventDefault();

const patientName = currentPatientName;
const testsTaken = document.getElementById('testsTaken').value;
const resultsObtained = document.getElementById('resultsObtained').value;
const medicationTaken = document.getElementById('medicationTaken').value;
const additionalNotes = document.getElementById('additionalNotes').value;

const recordData = {
  testsTaken: testsTaken,
  resultsObtained: resultsObtained,
  medicationTaken: medicationTaken,
  additionalNotes: additionalNotes
};


const patientRef = ref(database, `staff/${patientName}`);
const newRecordRef = push(child(patientRef, 'history'));
set(newRecordRef, recordData)
  .then(() => {
    addRecordForm.reset();
    showMessage('Record added successfully!');
  })
  .catch((error) => {
    console.error('Error adding record:', error);
    showMessage('Error adding record. Please try again.');
  });
});

function openPatientHistoryPopup(patient) {
  const popupOverlay = document.getElementById('popupOverlay1');
  const popupClose = document.getElementById('popupClose1');
  const patientHistory = document.getElementById('patientHistory');
  const patientCheckin = document.getElementById('patientCheckin');
  // Clear existing patient history
  patientHistory.innerHTML = '';
  patientCheckin.innerHTML = '';

  // Populate patient history in the popup
  // You can customize the format and content of the patient history here
  const patientHistoryContent = document.createElement('div');
  patientHistoryContent.innerHTML = `
    <p><strong>Name of Medicine:</strong> ${patient.name}</p>
    <p><strong>Date of Expiry:</strong> ${patient.dob}</p>
    <p><strong>Number of Pieces:</strong> ${patient.parents}</p>
    <p><strong>Date of Stock:</strong> ${patient.dos}</p>
    <p><strong>Medical History:</strong> ${patient.medicalHistory}</p>
  `;
  patientHistory.appendChild(patientHistoryContent);


// Fetch and display check-in details for the specific patient
const patientRef = ref(database, `staff/${patient.name}`);
const checkinRef = child(patientRef, 'checkin');
get(checkinRef)
.then((snapshot) => {
  if (snapshot.exists()) {
    const checkinData = snapshot.val();

    // Sort the check-in data by date in descending order
    const sortedCheckinData = Object.values(checkinData).sort((a, b) => {
      return new Date(b.checkInDate) - new Date(a.checkInDate);
    });

    // Create a table element for check-in details
    const table = document.createElement('table');
    table.classList.add('checkin-table');

    // Create table header row
    const headerRow = document.createElement('tr');
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Check-In Time';
    headerRow.appendChild(timeHeader);
    const dateHeader = document.createElement('th');
    dateHeader.textContent = 'Check-In Date';
    headerRow.appendChild(dateHeader);
    const checkoutHeader = document.createElement('th');
    checkoutHeader.textContent = 'Check-Out Time';
    headerRow.appendChild(checkoutHeader);
    table.appendChild(headerRow);

    // Iterate over each check-in record and display the details in table rows
    sortedCheckinData.forEach((checkinRecord) => {
      const row = document.createElement('tr');
      const timeCell = document.createElement('td');
      timeCell.textContent = checkinRecord.checkInTime;
      row.appendChild(timeCell);
      const dateCell = document.createElement('td');
      dateCell.textContent = checkinRecord.checkInDate;
      row.appendChild(dateCell);
      const checkoutCell = document.createElement('td');
      checkoutCell.textContent = checkinRecord.checkOutTime;
      row.appendChild(checkoutCell);
      table.appendChild(row);
    });

    // Prepend the table to the patientCheckin div
    patientCheckin.insertBefore(table, patientCheckin.firstChild);
  }
})
.catch((error) => {
  console.error('Error fetching check-in data:', error);
});


  // Open the popup
  popupOverlay.style.visibility = 'visible';
  popupOverlay.style.opacity = '1';
// Close the add record popup
addRecordPopupOverlay.style.visibility = 'hidden';
addRecordPopupOverlay.style.opacity = '0';

  // Close the popup when the close button is clicked
  popupClose.addEventListener('click', function() {
    popupOverlay.style.visibility = 'hidden';
    popupOverlay.style.opacity = '0';
  });




const patientHistoryElement = document.getElementById('patientHistory');

// Retrieve and display the patient's history
const patientName = patient.name; // Replace this with the patient's name
const patientHistoryRef = ref(database, `staff/${patientName}/history`);
onValue(patientHistoryRef, (snapshot) => {
patientHistoryElement.innerHTML = ''; // Clear previous records

if (snapshot.exists()) {
  snapshot.forEach((childSnapshot) => {
    const recordKey = childSnapshot.key;
    const record = childSnapshot.val();
    const recordElement = createRecordElement(recordKey, record);
    patientHistoryElement.appendChild(recordElement);
  });
} else {
  const noRecordsElement = document.createElement('p');
  noRecordsElement.textContent = 'No Records Found';
  noRecordsElement.style.fontStyle = 'italic';
  patientHistoryElement.appendChild(noRecordsElement);
}
});


// Function to create a record element
function createRecordElement(recordKey, record) {
const recordElement = document.createElement('div');
recordElement.classList.add('record');

const recordKeyElement = document.createElement('h4');
recordKeyElement.textContent = 'Record Key: ' + recordKey;
recordElement.appendChild(recordKeyElement);

const testsTakenElement = document.createElement('p');
testsTakenElement.textContent = 'Work Days: ' + record.testsTaken;
recordElement.appendChild(testsTakenElement);

const resultsObtainedElement = document.createElement('p');
resultsObtainedElement.textContent = 'Work Hours: ' + record.resultsObtained;
recordElement.appendChild(resultsObtainedElement);

const medicationTakenElement = document.createElement('p');
medicationTakenElement.textContent = 'Monthly Salary: Ug.shs ' + record.medicationTaken + ".00";
recordElement.appendChild(medicationTakenElement);

const additionalNotesElement = document.createElement('p');
additionalNotesElement.textContent = 'Daily Allowance: Ug.shs ' + record.additionalNotes + ".00" ;
recordElement.appendChild(additionalNotesElement);

// Create delete button
const deleteButton = document.createElement('button');
deleteButton.classList.add('delete-button');

// Create bin icon
const binIcon = document.createElement('i');
binIcon.classList.add('fa', 'fa-trash');

// Set the inner HTML of the delete button
deleteButton.innerHTML = '';
deleteButton.appendChild(binIcon);
deleteButton.innerHTML += ' Delete';


// Add click event listener to delete the record
deleteButton.addEventListener('click', () => {
  deleteRecord(recordKey);
});

// Append the delete button to the record element
recordElement.appendChild(deleteButton);

return recordElement;
}
// Function to delete a record from the database
function deleteRecord(recordKey) {
const patientName = patient.name; // Replace this with the patient's name

// Prompt the user for confirmation
const confirmation = confirm('Are you sure you want to delete this record?');

if (confirmation) {
  // Prompt the user for password
  const password = prompt('Please enter your password to confirm the deletion:');
  
  // Check if the password is correct
  if (password === 'mm') { // Replace 'your_password' with the actual password
    // Create a reference to the specific record in the patient's history
    const recordRef = ref(database, `staff/${patientName}/history/${recordKey}`);

    // Remove the record from the database
    remove(recordRef)
      .then(() => {
        alert('Record deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
        alert('Error deleting record. Please try again.');
      });
  } else {
    alert('Wrong password. Deletion cancelled.');
  }
}
}

};





// Open the add record popup
const addMedicationBtn = document.getElementById('addMedicationBtn');
const addRecordPopupOverlay = document.getElementById('addRecordPopupOverlay');
const addRecordPopupClose = document.getElementById('addRecordPopupClose');

addMedicationBtn.addEventListener('click', () => {
addRecordPopupOverlay.style.visibility = 'visible';
addRecordPopupOverlay.style.opacity = '1';
});

// Close the add record popup
addRecordPopupClose.addEventListener('click', () => {
addRecordPopupOverlay.style.visibility = 'hidden';
addRecordPopupOverlay.style.opacity = '0';
});


const loaderElement = document.getElementById('loader');

// Retrieve and render patients
const patientsRef = ref(database, 'staff');

// Show the loader
loaderElement.classList.remove('hidden');

onValue(patientsRef, (snapshot) => {
const patientsData = snapshot.val();

if (patientsData) {
  patients = Object.values(patientsData); // Update the patients variable
  renderPatients(patients);
}

// Hide the loader
loaderElement.classList.add('hidden');
});

const uploadForm = document.getElementById('addPatientForm');
uploadForm.addEventListener('submit', (e) => {
e.preventDefault();

// Assuming you have already initialized Firebase
const nameInput = document.getElementById('name');
const dobInput = document.getElementById('dob');
const parentsInput = document.getElementById('parents');

const database = getDatabase();

// Save patient data to Firebase
const savePatientData = () => {
const name = nameInput.value;
const dob = dobInput.value;
const parents = parentsInput.value;

const patientsRef = ref(database, 'staff');
const newPatientRef = child(patientsRef, name); // Use patient name as the key

set(newPatientRef, {
  name: name,
  dob: dob,
  parents: parents
})
  .then(() => {
    nameInput.value = '';
    dobInput.value = '';
    parentsInput.value = '';

    showMessage('Patient details uploaded successfully!');
  })
  .catch((error) => {
    console.error('Error uploading patient details:', error);
    showMessage('Error uploading patient details. Please try again.');
  });
};

const showMessage = (message) => {
const messageElement = document.getElementById('message');
messageElement.textContent = message;
messageElement.style.display = 'block';

setTimeout(() => {
  messageElement.style.display = 'none';
}, 3000);
};



});

// Get the online status element
const onlineStatusElement = document.getElementById('onlineStatus');
const overlayElement = document.getElementById('overlay');

// Function to update the online status indicator
function updateOnlineStatus() {
if (navigator.onLine) {
  onlineStatusElement.innerHTML = '<i class="fa fa-wifi"></i>';
  onlineStatusElement.classList.remove('offline');
  onlineStatusElement.classList.add('online');
  overlayElement.style.display = 'none';
} else {
  onlineStatusElement.innerHTML = '<i class="fa fa-exclamation-triangle"></i>';
  onlineStatusElement.classList.remove('online');
  onlineStatusElement.classList.add('offline');
  overlayElement.style.display = 'block';
}
}


// Initial update of online status
updateOnlineStatus();

// Add event listeners for online and offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('load', function () {
    const splashScreen = document.getElementById('splashScreen');
    splashScreen.style.opacity = '0';
    setTimeout(function () {
      splashScreen.style.display = 'none';
    }, 500); // Change this duration to control how long the splash screen is shown (in milliseconds)
  });


  const openChatBtn = document.getElementById('openChatBtn');
const chatOverlay = document.getElementById('chatOverlay');
const chatContainer = document.getElementById('chatContainer');

openChatBtn.addEventListener('click', () => {
  chatOverlay.style.display = 'block'; // Show overlay
  chatContainer.style.display = 'block'; // Show chat container
});

// Close chat on overlay click
chatOverlay.addEventListener('click', () => {
  chatOverlay.style.display = 'none'; // Hide overlay
  chatContainer.style.display = 'none'; // Hide chat container
});





    // Get a reference to the database
    const messagesRef = ref(database, 'chat-messages');
    const chatBox = document.getElementById('chatBox');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    // Audio for message sent
    const messageSentAudio = new Audio('');

    
    // Audio for new message received
    const newMessageAudio = new Audio('');
    
    // Array to store IDs of displayed messages
    let displayedMessageIds = [];
    
    // Listen for new messages
    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          const message = childSnapshot.val();
    
          // Display the message only if it's not already displayed
          if (!displayedMessageIds.includes(messageId)) {
            displayChatMessage(message);
            playMessageSound(message.sender);
            displayedMessageIds.push(messageId);
          }
        });
      }
    });
    
// Function to display messages in the chatBox
function displayChatMessage(message) {
  if (message) {
    const messageDiv = document.createElement('div');

// Display sender's name and profile icon in the header
const headerDiv = document.createElement('div');
headerDiv.classList.add('message-header');

// Creating the profile icon element (assuming it's an image)
const profileIcon = document.createElement('img');
profileIcon.src = 'profile.webp'; // Add the path to your profile icon image
profileIcon.classList.add('profile-icon2');
headerDiv.appendChild(profileIcon);

// Creating the span for sender's name
const nameSpan = document.createElement('span');
nameSpan.textContent = message.sender;
nameSpan.style.fontWeight = 'bold';
headerDiv.appendChild(nameSpan);

    messageDiv.appendChild(headerDiv);

    // Display message text
    const messageTextSpan = document.createElement('span');
    messageTextSpan.textContent = message.text;
    messageDiv.appendChild(messageTextSpan);

    // Display timestamp in 6:00 pm format
    const timestampSpan = document.createElement('span');
    const timestamp = new Date(message.timestamp);
    const formattedDate = `${timestamp.toLocaleDateString()} `;
    const formattedTime = `${timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    timestampSpan.textContent = `${formattedDate}${formattedTime}`;
    timestampSpan.style.fontSize = '9px'; // Set font size for the timestamp
    timestampSpan.style.color = '#888'; // Set color for the timestamp
    messageDiv.appendChild(timestampSpan);

    // Add different classes based on the sender
    if (message.sender === 'Staff') {
      messageDiv.classList.add('patients-reception');
    } else {
      messageDiv.classList.add('other-sender');
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
  }
}

// Function to play message sound
function playMessageSound(sender) {
  if (sender === 'Staff') {
    messageSentAudio.play();
  } else {
    newMessageAudio.play();
  }
}

openChatBtn.addEventListener('click', () => {
  chatOverlay.style.display = 'block'; // Show overlay
  chatContainer.style.display = 'block'; // Show chat container
});

// Close chat on overlay click
chatOverlay.addEventListener('click', () => {
  chatOverlay.style.display = 'none'; // Hide overlay
  chatContainer.style.display = 'none'; // Hide chat container
});
// Function to send the message
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== '') {
    const sender = 'Staff'; // You can replace 'User' with the actual username or user ID
    const timestamp = new Date().toISOString();
    const message = { text: messageText, sender: sender, timestamp: timestamp };

    // Save the message to Firebase
    push(messagesRef, message)
      .catch((error) => {
        console.error('Error sending message:', error);
      });

    messageInput.value = ''; // Clear the input field
  }
}


// Event listener for the Send button
sendMessageBtn.addEventListener('click', sendMessage);

// Event listener for the Enter key in the input field
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});