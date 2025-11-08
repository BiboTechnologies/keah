
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import { getDatabase,query,limitToFirst,orderByKey, ref, remove, push, get, update, onValue, child, set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
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
const auth = getAuth(app);
const storage = getStorage(app);


const fetchPatientCountBtn = document.getElementById('fetchPatientCountBtn');

// Function to fetch the latest patient count using unique patient IDs as node names
function fetchPatientCount() {
  const patientsRef = ref(database, 'patients');

  get(patientsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const patientData = snapshot.val();
        const patientIds = Object.keys(patientData); // Get the patient IDs (unique node names)
        const numericPatientIds = patientIds.map((patientId) => parseInt(patientId));
        patientCount = Math.max(...numericPatientIds, 0) + 1;

        showMessage(`Next Patient Count: ${patientCount}`);
      } else {
        patientCount = 1; // If no patient data exists, start from 1
        showMessage(`No patients found. Starting from Patient ID: ${patientCount}`);
      }
    })
    .catch((error) => {
      console.error('Error retrieving patient count:', error);
      showMessage('Error retrieving patient count. Please try again.');
    });
}

// Add event listener to the fetch patient count button
fetchPatientCountBtn.addEventListener('click', fetchPatientCount);

  var uploadBtn = document.getElementById('uploadBtn');
        var popupOverlay = document.getElementById('popupOverlay');
        var popupClose = document.getElementById('popupClose');
      uploadBtn.addEventListener('click', function() {
      popupOverlay.style.visibility = 'visible';
      popupOverlay.style.opacity = '1';
      fetchPatientCount()
      });
      
      popupClose.addEventListener('click', function() {
      popupOverlay.style.visibility = 'hidden';
      popupOverlay.style.opacity = '0';
      });
   
      
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




displayMessage('', 'Please wait...', false); // Pass false for error message

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

/*const medicationTakenSelect = document.getElementById('medicationTaken');

// Retrieve medicines from Firebase and populate the select options
const medicinesRef = ref(database, 'medicine');
onValue(medicinesRef, (snapshot) => {
  const medicinesData = snapshot.val();

  // Clear existing options
  medicationTakenSelect.innerHTML = '';

  // Add options for each medicine
  if (medicinesData) {
    const medicines = Object.values(medicinesData);
    medicines.forEach((medicine) => {
      const option = document.createElement('option');
      option.value = medicine;
      option.textContent = medicine.name;
      medicationTakenSelect.appendChild(option);
    });
  }
});*/
const form = document.querySelector('.popup-form');
const submitButton = document.querySelector('.popup-form button');
const patientsContainer = document.getElementById('patients');
const loader = document.getElementById('loader'); // Add the loader element
let patients = []; // Declare patients variable outside the event listener
let patientCount = 1; // Initialize patient count

// Retrieve the maximum patient count from the database
const patientsRef = ref(database, 'patients');
get(patientsRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const patientData = snapshot.val();
      const patientIds = Object.values(patientData).map((patient) => parseInt(patient.patientId));
      patientCount = Math.max(...patientIds, 0) + 1;
    } else {
      patientCount = 1; // If no patient data exists, start from 1
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim(); // Remove leading and trailing spaces
      const dob = document.getElementById('dob').value;
      const parents = document.getElementById('parents').value;
      const residence = document.getElementById('residence').value;
      const payment = document.getElementById('payment').value;
      const sex = document.getElementById('sex').value;
      const patientId = patientCount.toString(); // Generate patient ID as plain number

      const patientData = {
        name: name,
        dob: dob,
        parents: parents,
        residence: residence,
        payment: payment,
        sex: sex,
        patientId: patientId
      };

      const newPatientRef = ref(database, `patients/${name}`); // Use patient name as the key

      // Check if patient with the same name already exists
      get(newPatientRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Display an alert if patient with the same name already exists
            alert('Patient with the same name already exists.');
          } else {
            // Show the loader
            loader.style.display = 'block';

            // Save the new patient data
            set(newPatientRef, patientData)
              .then(() => {
                form.reset();
                showMessage('Patient details uploaded successfully!');
                patientCount++; // Increment patient count

                // Hide the loader
                loader.style.display = 'none';
              })
              .catch((error) => {
                console.error('Error uploading patient details:', error);
                showMessage('Error uploading patient details. Please try again.');

                // Hide the loader
                loader.style.display = 'none';
              });
          }
        })
        .catch((error) => {
          console.error('Error checking if patient exists:', error);
          showMessage('Error checking if patient exists. Please try again.');

          // Hide the loader
          loader.style.display = 'none';
        });
    });
  })
  .catch((error) => {
    console.error('Error retrieving patient count:', error);
    showMessage('Error retrieving patient count. Please try again.');
  });


// Add event listener to search button
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim(); // Get the search term

  // Show the loader
  loaderElement.classList.remove('hidden');

  // Clear the patients container
  patientsContainer.innerHTML = '';

  // Search through Firebase for patient names and IDs
  const patientsRef = ref(database, 'patients');
  onValue(patientsRef, (snapshot) => {
    const patientsData = snapshot.val();
    const searchResults = [];

    if (patientsData) {
      const patients = Object.entries(patientsData);

      if (searchTerm !== '') {
        // Filter patients based on the search term
        patients.forEach(([patientId, patient]) => {
          if (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.patientId.includes(searchTerm)) {
            searchResults.push(patient);
          }
        });
      } else {
        // Display all patients if the search term is empty
        searchResults.push(...patients.map(([patientId, patient]) => patient));
      }
    }

    // Hide the loader
    loaderElement.classList.add('hidden');

    // Display search results
    if (searchResults.length > 0) {
      renderPatients(searchResults);
    } else {
      patientsContainer.innerHTML = '<p class="no-results">No Patients found.</p>';
    }
  });
});

// Function to filter patients based on the search term
function filterPatients(patients, searchTerm) {
  const filteredPatients = patients.filter((patient) => {
    const patientName = patient.name.toLowerCase();
    return patientName.includes(searchTerm.toLowerCase());
  });
  renderPatients(filteredPatients);
}

// Define variables
let patientsData = []; // Store all patient data
let searchResults = []; // Store search results
let currentPage = 1;
const patientsPerPage = 100;

// Add event listener to search input for live search
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase(); // Get the search term

  // Clear the search results
  searchResults = [];

  if (searchTerm !== '') {
    // Filter patients based on the search term
    searchResults = patientsData.filter(patient => {
      return (
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.patientId.includes(searchTerm)
      );
    });
  }

  // Update the pagination and render the patients
  currentPage = 1;
  renderPatients();
});

// Fetch a limited number of patients from Firebase (e.g., 50 patients at a time)
const patientsRef2 = query(ref(database, 'patients'), limitToFirst(5000)); // Adjust the limit as needed

onValue(patientsRef2, (snapshot) => {
  patientsData = snapshot.val() ? Object.values(snapshot.val()) : [];

  // Update pagination and render the patients
  renderPatients();
});



// ====================== PLACEHOLDERS ======================
function renderPlaceholders(rows = 5) {
  patientsContainer.innerHTML = '';
  const table = document.createElement('table');
  table.classList.add('patient-table');

  const headers = ['Name', 'Place of Residence', 'Payment Terms', 'Sex', 'Patient ID', 'Contact', 'Date of Birth', 'Age', 'Actions'];

  // Header
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Skeleton rows
  for (let i = 0; i < rows; i++) {
    const row = document.createElement('tr');
    row.classList.add('placeholder-row');

    headers.forEach(() => {
      const cell = document.createElement('td');
      const skeletonDiv = document.createElement('div');
      skeletonDiv.classList.add('skeleton');
      cell.appendChild(skeletonDiv);
      row.appendChild(cell);
    });

    table.appendChild(row);
  }

  patientsContainer.appendChild(table);
}

// ====================== CONFIG ======================

let lastFetchedKey = null;
const batchSize = 40;
let loading = false;

const paginationDiv = document.getElementById('pagination');

// ====================== FETCH IN BATCHES ======================
async function fetchPatientsBatch() {
  if (loading) return;
  loading = true;

  // Show skeleton immediately
  renderPlaceholders(patientsPerPage);

  let patientsQuery;
  if (lastFetchedKey) {
    patientsQuery = query(
      patientsRef,
      orderByKey(),
      startAfter(lastFetchedKey),
      limitToFirst(batchSize)
    );
  } else {
    patientsQuery = query(
      patientsRef,
      orderByKey(),
      limitToFirst(batchSize)
    );
  }

  try {
    const snapshot = await get(patientsQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const newPatients = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));

      lastFetchedKey = newPatients[newPatients.length - 1].id;
      patientsData = [...patientsData, ...newPatients];
      renderPatients(); // render first page
    } else {
      renderPatients();
    }
  } catch (error) {
    console.error('Error fetching patients:', error);
  } finally {
    loading = false;
  }
}
// Function to check if it's today's date (helper function)
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
}
// ====================== RENDER FUNCTION ======================
function renderPatients() {
  const dataToDisplay = searchResults.length > 0 ? searchResults : patientsData;
  if (dataToDisplay.length === 0) {
    patientsContainer.innerHTML = '<p>No patients found.</p>';
    paginationDiv.innerHTML = '';
    return;
  }

  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;
  const patientsForPage = dataToDisplay.slice(startIndex, endIndex);

  const table = document.createElement('table');
  table.classList.add('patient-table');

  const headers = ['Name', 'Place of Residence', 'Payment Terms', 'Sex', 'Patient ID', 'Contact', 'Date of Birth', 'Age', 'Actions'];
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Collect patients with birthdays today
  const todayPatients = [];

  patientsForPage.forEach(patient => {
    const row = document.createElement('tr');

    const nameCell = createTableCell(patient.name);
    const residenceCell = createTableCell(patient.residence);
    const paymentCell = createTableCell(patient.payment);
    const sexCell = createTableCell(patient.sex);
    const idCell = createTableCell('PI - ' + (patient.patientId || patient.id));
    const contactCell = createHiddenDigitsTableCell(patient.parents || '', 3);
    const dobCell = createTableCell(patient.dob || '');
    const ageCell = createTableCell(patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : '');

    const actionCell = document.createElement('td');
    const viewButton = document.createElement('button');
    viewButton.textContent = 'View';
    viewButton.classList.add('view-button');
    viewButton.addEventListener('click', () => openPatientHistoryPopup(patient));
    actionCell.appendChild(viewButton);

    [nameCell, residenceCell, paymentCell, sexCell, idCell, contactCell, dobCell, ageCell, actionCell].forEach(c => row.appendChild(c));

    // Birthday highlight
    if (patient.dob && isToday(new Date(patient.dob))) {
      dobCell.style.backgroundColor = 'yellow';
      dobCell.innerHTML += ' 🎂🎁';
      todayPatients.push(patient);
    }

    table.appendChild(row);
  });

  patientsContainer.innerHTML = '';
  patientsContainer.appendChild(table);

  renderPagination(dataToDisplay.length);

  // Trigger birthday messaging popup if any
  if (todayPatients.length > 0) openBirthdayMessagePopup(todayPatients);
}

// ====================== PAGINATION ======================
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / patientsPerPage);
  paginationDiv.innerHTML = '';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPatients();
    }
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      if ((currentPage * patientsPerPage) > patientsData.length) {
        fetchPatientsBatch();
      } else {
        renderPatients();
      }
    }
  });

  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  paginationDiv.append(prevButton, pageInfo, nextButton);
}

// ====================== SEARCH ======================
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  searchResults = [];

  if (searchTerm !== '') {
    searchResults = patientsData.filter(patient => {
      return (
        (patient.name && patient.name.toLowerCase().includes(searchTerm)) ||
        (patient.patientId && patient.patientId.includes(searchTerm))
      );
    });
  }

  currentPage = 1;
  renderPatients();
});

// ====================== HELPERS ======================
function createTableCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text || '';
  return cell;
}

function createHiddenDigitsTableCell(text, visibleDigitsCount) {
  const cell = document.createElement('td');
  if (!text) {
    cell.textContent = '';
    return cell;
  }
  if (text.length <= visibleDigitsCount) {
    cell.textContent = text;
  } else {
    const hiddenDigits = '*'.repeat(text.length - visibleDigitsCount);
    const visibleDigits = text.slice(-visibleDigitsCount);
    cell.textContent = hiddenDigits + visibleDigits;
  }
  return cell;
}


// ====================== BIRTHDAY POPUP & MESSAGING ======================
function openBirthdayMessagePopup(patients) {
  const popup = document.getElementById('birthdayMessagePopup');
  const table = document.getElementById('patientsTable');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeMessagePopup');

  if (!popup || !table || !overlay || !closeBtn) return;

  table.innerHTML = '';
  patients.forEach(p => {
    const row = table.insertRow();
    const nameCell = row.insertCell(0);
    const phoneCell = row.insertCell(1);
    nameCell.textContent = p.name;
    phoneCell.textContent = p.parents;
  });

  popup.classList.add('active');
  overlay.style.display = 'block';

  const sendBtn = document.getElementById('sendBirthdayMessage');
  if (sendBtn) {
    sendBtn.onclick = () => {
      const messageInput = document.getElementById('birthdayMessageInput').value;
      const hospitalName = 'Sanyu Hospital';
      const hospitalInfo = 'Katooke Wakiso District, Uganda';

      patients.forEach((p, i) => {
        setTimeout(() => {
          const message = `🎉 Happy Birthday, ${p.name}! 🎂🎁\n\n${messageInput}\nFrom ${hospitalName}\nAddress: ${hospitalInfo}`;
          window.open(`https://api.whatsapp.com/send?phone=${p.parents}&text=${encodeURIComponent(message)}`);
        }, i * 3000);
      });

      overlay.style.display = 'none';
      popup.style.display = 'none';
    };
  }

  closeBtn.onclick = () => {
    overlay.style.display = 'none';
    popup.style.display = 'none';
  };
}

// ====================== INITIAL LOAD ======================
document.addEventListener('DOMContentLoaded', () => {
  fetchPatientsBatch();
});




















function openPatientHistoryPopup(patient) {
  const popupOverlay = document.getElementById('popupOverlay1');
  const popupClose = document.getElementById('popupClose1');
  const patientDetails = document.getElementById('patientDetails');
  const patientHistory = document.getElementById('patientHistory');

  // Clear existing patient details and history
  patientDetails.innerHTML = '';
  patientHistory.innerHTML = '';

  // Open the popup
  popupOverlay.style.visibility = 'visible';
  popupOverlay.style.opacity = '1';

  // Close the popup when the close button is clicked
  popupClose.addEventListener('click', function () {
    popupOverlay.style.visibility = 'hidden';
    popupOverlay.style.opacity = '0';
  });

  const patientDetailsHTML = `
  <div class="patient-details">
    <div class="patient-image-frame">
  <label for="uploadImage" class="upload-label">
    <i class="fa fa-upload"></i>
    Click to Upload Patient's Image or drag and drop here
  </label>
  <input type="file" id="uploadImage" accept="image/*">
</div>
<style>
  .button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin: 4px 2px;
    cursor: disabled;
    border-radius: 50px;
  }

  .save-button {
    background-color: #4CAF50;
  }

  .delete-button {
    background-color: #f44336;
  }
</style>

    
<h3>Patient Demographics:</h3>
<table class="patient-demographics-table">
    <tr>
      <td><strong>Name:</strong></td>
      <td>${patient.name}</td>
    </tr>
    <tr>
      <td><strong>Date of Birth:</strong></td>
      <td>${patient.dob}</td>
    </tr>
    <tr>
      <td><strong>Gender:</strong></td>
      <td>${patient.sex}</td>
    </tr>
    <tr>
      <td><strong>Payment Type:</strong></td>
      <td>${patient.payment}</td>
    </tr>
    <tr>
      <td><strong>Residence:</strong></td>
      <td>${patient.residence}</td>
    </tr>
    <tr>
      <td><strong>Contact:</strong></td>
      <td>${patient.parents}</td>
    </tr>
     <tr>
    <td><strong>Next of Kin Telephone Contact:</strong></td>
    <td>${patient.nok || 'Not Found'}</td>
  </tr>
    <tr>
      <td><strong>Patient ID:</strong></td>
      <td>${patient.patientId}</td>
    </tr>
    <tr>
      <td><strong>Current Patient's Status:</strong></td>
      <td><span id="currentStatus"></span></td>
    </tr>
  </table>
    <!-- Add a "Visit Count" element in your HTML -->
    <p style="text-decoration: underline;"><strong>No. of visits:</strong>  <span id="visitCount"></span></p>
    <!-- Add more patient details as needed -->

    <!-- The container for patient visit details -->
<div id="patientVisitDetails" ></div>



          <button  style="background: darkblue; " id="triageButton"  class="button save-button"><i style="margin-right: 5px;" class="fas fa-chart-line"></i>Triage History</button>
<!--
<button id="saveButton"  class="button save-button" disabled><i style="margin-right: 5px;" class="fa fa-save"></i>Save Image</button>
<button id="delButton" class="button delete-button"><i class="fa fa-trash"></i>Delete Image</button>
--!>
  </div>
  `;

  patientDetails.innerHTML = patientDetailsHTML;

// Function to display the patient's visit details in the popup
function displayVisitsPopup(patientName) {
  // Get the reference to the patient's visits node in Firebase
  const visitsRef = ref(database, `patients/${patientName}/visits`);

  // Clear the existing content of the table body and canvas
  const tableBody = document.getElementById('tableBody');
  const visitTrendCanvas = document.getElementById('visitTrendChart');
  tableBody.innerHTML = '';
  visitTrendCanvas.getContext('2d').clearRect(0, 0, visitTrendCanvas.width, visitTrendCanvas.height);

  // Retrieve the patient's visits from Firebase
  onValue(visitsRef, (snapshot) => {
    const visitDetails = snapshot.val();

    if (visitDetails) {
      // Create an array of visit keys
      const visitKeys = Object.keys(visitDetails);

      // Sort the visit keys in descending order based on timestamp
      visitKeys.sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

      // Loop through the visits and display each visit's data in the table
      visitKeys.forEach((visitKey) => {
        const visitData = visitDetails[visitKey];

        // Create a table row for each visit
        const row = document.createElement('tr');

// Add the visit details to the row
row.innerHTML = `
  <td>${formatDate(visitData.timestamp)}</td>
  <td>${visitData.clinicianName}</td>
  <td>${visitData.temperature} &deg;C</td>
  <td>${visitData.bp}</td>
  <td>${visitData.rr}</td>
  <td>${visitData.hr}</td>
  <td>${visitData.sp02}</td>
  <td>${visitData.wt}</td>
  <td>${visitData.ht}</td>
  <td>${visitData.bmi}</td>
  <td>${visitData.muac}</td>
  <td>${visitData.weightForAgeZScore}</td>
  <td>${visitData.disability}</td>
  <td>${visitData.chronicIllness}</td>
  <td>${visitData.drugAbuse}</td>
  <td>${Array.isArray(visitData.allergies) ? visitData.allergies.join(', ') : ''}</td>
`;

tableBody.appendChild(row);
});


      // Call the function to create the chart after displaying the visits data
      createVisitTrendChart(visitKeys, visitDetails);
    } else {
      // If no visit details found, display a message
      const noVisitsRow = document.createElement('tr');
      noVisitsRow.innerHTML = '<td colspan="17">No visit details found.</td>';
      tableBody.appendChild(noVisitsRow);
    }
  });

  // Show the popup
  const popupOverlay = document.getElementById('popup-overlay4');
  popupOverlay.style.display = 'block';
}

// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}


// Get the close button element and add the click event listener to close the popup
const closePopupBtn4 = document.getElementById('closePopupBtn4');
closePopupBtn4.addEventListener('click', () => {
  const popupOverlay = document.getElementById('popup-overlay4');
  popupOverlay.style.display = 'none';
});
  
  const patientHistoryElement = document.getElementById('patientHistory');

// Get references to the elements
//const uploadImage = document.getElementById('uploadImage');
//const saveButton = document.getElementById('saveButton');
const imageFrame = document.querySelector('.patient-image-frame');
// ...

// Check if the patient has an image URL
if (patient.image) {
  // Create the image element
  const imageElement = document.createElement('img');
  imageElement.src = patient.image;
  imageElement.alt = 'Patient Image';

  // Append the image to the frame
  imageFrame.innerHTML = '';
  imageFrame.appendChild(imageElement);
} else {
  // Show the upload input if no image is available
  const uploadLabel = document.createElement('p');
  uploadLabel.htmlFor = 'uploadImage';
  uploadLabel.className = 'no-image-label';
  uploadLabel.innerHTML = `
  <i class="fas fa-image"></i>
  No Image found
`;


  const uploadInput = document.createElement('input');
  uploadInput.type = 'file';
  uploadInput.id = 'uploadImage';
  uploadInput.accept = 'image/*';

  imageFrame.innerHTML = '';
  imageFrame.appendChild(uploadLabel);
  imageFrame.appendChild(uploadInput);

  // Handle file selection
  uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const imageUrl = e.target.result;

      // Create the image element
      const imageElement = document.createElement('img');
      imageElement.src = imageUrl;
      imageElement.alt = 'Patient Image';

      // Append the image to the frame
      imageFrame.innerHTML = '';
      imageFrame.appendChild(imageElement);

      // Enable the save button
      saveButton.disabled = false;
    };

    reader.readAsDataURL(file);
  });
}
  /*
// Handle save button click
saveButton.addEventListener('click', function () {
  // Show loading spinner
  saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  // Get the image data from the image element
  const imageElement = imageFrame.querySelector('img');
  const imageData = imageElement.src;

  // Get the patient name
  const patientName = patient.name;

  // Generate a unique filename for the image using the patient's name
  const filename = `${patientName}_${Date.now()}.jpg`;

  // Save the image data to Firebase Storage under the patient's name
  const imageRef = storageRef(storage, `images/${filename}`);
  const imageBlob = dataURItoBlob(imageData);

  // Upload the image blob to Firebase Storage
  const uploadTask = uploadBytes(imageRef, imageBlob);

  // Monitor the upload completion using the then method
  uploadTask
    .then(function () {
      // The image has been successfully uploaded
      // Get the download URL of the image
      getDownloadURL(imageRef)
        .then(function (downloadURL) {
          // Save the download URL to the patient's data in Firebase
          const patientRef = ref(database, `patients/${patient.name}`);
          update(patientRef, {
            image: downloadURL,
          });

          // Show success message or perform any additional actions
          showMessage('Image saved successfully!');
        })
        .finally(() => {
          // Revert back to the original button text after the save is complete or fails
          saveButton.textContent = 'Save';
        });
    })
    .catch(function (error) {
      // Handle the upload error
      console.error('Error uploading image:', error);
      showMessage('Error uploading image. Please try again.');
      // Revert back to the original button text if there's an error
      saveButton.textContent = 'Save';
    });
});

const deleteButton = document.getElementById('delButton')
// ...

// Handle delete button click
deleteButton.addEventListener('click', function () {
  if (!patient.image) {
    // No image available, do nothing
    return;
  }

  // Update the patient's data to remove the image reference
  const patientRef = ref(database, `patients/${patient.name}`);
  update(patientRef, {
    image: null,
  })
    .then(() => {
      imageFrame.innerHTML = '';

      // Disable the delete button
      deleteButton.disabled = true;

      // Show success message or perform any additional actions
      showMessage('Image deleted successfully!');
    })
    .catch((error) => {
      console.error('Error deleting image:', error);
      showMessage('Error deleting image. Please try again.');
    });
});

// ...
*/


// Check if the patient has an image URL
if (patient.image) {
  // Create the image element
  const imageElement = document.createElement('img');
  imageElement.src = patient.image;
  imageElement.alt = 'Patient Image';

  // Append the image to the frame
  imageFrame.innerHTML = '';
  imageFrame.appendChild(imageElement);

  // Enable the delete button
  //deleteButton.disabled = false;
}
// ...


function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
}





 // Retrieve and display the patient's history
const patientName = patient.patientId; // Replace this with the patient's name
const patientHistoryRef = ref(database, `patients/${patientName}/testsTaken`);

// Function to get the latest test status
function getLatestTestStatus(records) {
  if (records.length === 0) return 'Unknown';

  // Sort the records by dateTaken in descending order
  records.sort((a, b) => b.data.dateTaken - a.data.dateTaken);

  // Get the status of the latest test result
  const latestTestStatus = records[0].data.results?.finalStatus || 'Pending...';
  return latestTestStatus;
}

onValue(patientHistoryRef, (snapshot) => {
  patientHistoryElement.innerHTML = ''; // Clear previous records

  if (snapshot.exists()) {
    const records = [];
    snapshot.forEach((childSnapshot) => {
      const recordKey = childSnapshot.key;
      const record = childSnapshot.val();
      records.push({ key: recordKey, data: record });
    });

    // Get the patient's current status from the latest test result
    const currentStatusElement = document.getElementById('currentStatus');
    const currentStatus = getLatestTestStatus(records);
    currentStatusElement.textContent =  currentStatus;
    //currentStatusElement.style.color = currentStatus === 'Completed Successfully' ? 'darkblue' : 'orange';

    records.forEach((recordObj) => {
      const recordKey = recordObj.key;
      const record = recordObj.data;

      // Create the record element and add it to the patientHistoryElement
      const recordElement = createRecordElement(recordKey, record);
      patientHistoryElement.appendChild(recordElement);

      // Reference the test result node in Firebase
      const testResultRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}/resultsObtained`);

      // Listen for changes in the test result status
      onValue(testResultRef, (resultSnapshot) => {
        const resultsObtainedElement = recordElement.querySelector('.results-obtained-data');
        if (resultsObtainedElement) {
          if (resultSnapshot.exists()) {
            const resultsObtained = resultSnapshot.val();
            resultsObtainedElement.textContent = (resultsObtained === 'Completed Successfully' ? 'Completed Successfully' : 'Pending...');
            resultsObtainedElement.style.color = resultsObtained === 'Completed Successfully' ? 'darkblue' : 'orange';
          } else {
            resultsObtainedElement.textContent = 'Pending...';
            resultsObtainedElement.style.color = 'orange';
          }
        } else {
          console.error("results-obtained-data element not found in recordElement");
        }
      });
    });
  } else {
    const noRecordsElement = document.createElement('p');
    noRecordsElement.textContent = 'No Records Found';
    noRecordsElement.style.fontStyle = 'italic';
    patientHistoryElement.appendChild(noRecordsElement);
  }
});








// Function to close the popup
function closePopup() {
  visitPopupOverlay.style.display = 'none';
}

// Event listener for the "Cancel" button
//const cancelVisitBtn = document.getElementById('cancelVisitBtn');
//cancelVisitBtn.addEventListener('click', closePopup);

// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}

// Variable to store the reference to the current chart
let visitTrendChart;

// Function to destroy the previous chart if it exists
function destroyChart() {
  if (window.visitTrendChart && window.visitTrendChart.destroy) {
    window.visitTrendChart.destroy();
  }
}

// Function to analyze the trend and provide recommendations
function analyzeAndProvideRecommendations(temperatures, respiratoryRates, heartRates, spO2Values, vitalSignsData) {
  // Analyze the trend and generate recommendations based on the vital signs data
  const newTemperature = temperatures[0];
  const previousTemperature = temperatures[1];
  const temperatureDifference = newTemperature - previousTemperature;

  const newRespiratoryRate = respiratoryRates[0];
  const previousRespiratoryRate = respiratoryRates[1];
  const respiratoryRateDifference = newRespiratoryRate - previousRespiratoryRate;

  const newHeartRate = heartRates[0];
  const previousHeartRate = heartRates[1];
  const heartRateDifference = newHeartRate - previousHeartRate;

  const newSpO2 = spO2Values[0];
  const previousSpO2 = spO2Values[1];
  const spO2Difference = newSpO2 - previousSpO2;

  // Assuming 'wt' is the weight data
  const weightValues = vitalSignsData.map((data) => data.wt);

  // Calculate weight difference
  const lastWeight = weightValues[0];
  const previousWeight = weightValues[1];
  const weightDifference = lastWeight - previousWeight;

  const normalRanges = {
    temperature: { min: 36.1, max: 37.2 },
    respiratoryRate: { min: 12, max: 20 },
    heartRate: { min: 60, max: 100 },
    spO2: { min: 95, max: 100 },
    weight: { min: 50, max: 80 }
  };


  function getNoteAndIconClass(vital, value) {
  const normalRange = normalRanges[vital];
  let potentialSicknesses = '';

  if (isNaN(value) || value === 0) {
    return { note: 'No data registered yet', iconClass: 'no-data' };
  } else if (value < normalRange.min) {
    potentialSicknesses = '<ul>PS:';
    switch (vital) {
      case 'temperature':
        potentialSicknesses += '<li>Hypothermia</li><li>Exposure to cold conditions</li><li>Metabolic disorders</li>';
        break;
      case 'respiratoryRate':
        potentialSicknesses += '<li>Bradypnea</li><li>Overdose of certain medications</li><li>Neurological disorders</li>';
        break;
      case 'heartRate':
        potentialSicknesses += '<li>Bradycardia</li><li>Heart block</li><li>Hypothyroidism</li>';
        break;
      case 'spO2':
        potentialSicknesses += '<li>Hypoxemia</li><li>Respiratory distress</li><li>Lung disease</li>';
        break;
      case 'weight':
        potentialSicknesses += '<li>Malnutrition</li><li>Eating disorders</li><li>Chronic illness</li>';
        break;
      default:
        potentialSicknesses += '<li>Unknown potential sicknesses</li>';
    }
    potentialSicknesses += '</ul>';
    return { note: `Below normal range: ${potentialSicknesses}`, iconClass: 'below-normal' };
  } else if (value > normalRange.max) {
    potentialSicknesses = '<ul>PS:';
    switch (vital) {
      case 'temperature':
        potentialSicknesses += '<li>Fever</li><li>Infection</li><li>Inflammatory disorders</li>';
        break;
      case 'respiratoryRate':
        potentialSicknesses += '<li>Tachypnea</li><li>Respiratory distress</li><li>Anxiety</li><li>Lung diseases</li>';
        break;
      case 'heartRate':
        potentialSicknesses += '<li>Tachycardia</li><li>Hypertension</li><li>Anxiety</li><li>Heart disease</li>';
        break;
      case 'spO2':
        potentialSicknesses += '<li>Unknown potential sicknesses</li>';
        break;
      case 'weight':
        potentialSicknesses += '<li>Overweight</li><li>Obesity</li><li>Metabolic disorders</li>';
        break;
      default:
        potentialSicknesses += '<li>Unknown potential sicknesses</li>';
    }
    potentialSicknesses += '</ul>';
    return { note: `Above normal range: ${potentialSicknesses}`, iconClass: 'above-normal' };
  } else {
    return { note: `Within normal range.`, iconClass: 'normal' };
  }
}

const trendAnalysis = `
  <div class="trend-container">
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('temperature', previousTemperature).iconClass}"><i class="fas fa-thermometer-half"></i></span>
      <span class="info">
        <strong>Temperature:</strong> ${getNoteAndIconClass('temperature', previousTemperature).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('respiratoryRate', previousRespiratoryRate).iconClass}"><i class="fas fa-lungs"></i></span>
      <span class="info">
        <strong>Respiratory Rate:</strong> ${getNoteAndIconClass('respiratoryRate', previousRespiratoryRate).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('heartRate', previousHeartRate).iconClass}"><i class="fas fa-heartbeat"></i></span>
      <span class="info">
        <strong>Heart Rate:</strong> ${getNoteAndIconClass('heartRate', previousHeartRate).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('spO2', previousSpO2).iconClass}"><i class="fas fa-chart-line"></i></span>
      <span class="info">
        <strong>SpO2 Levels:</strong> ${getNoteAndIconClass('spO2', previousSpO2).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('weight', previousWeight).iconClass}"><i class="fas fa-weight"></i></span>
      <span class="info">
        <strong>Weight:</strong> ${getNoteAndIconClass('weight', previousWeight).note}
      </span>
    </div>
  </div>
`;

return { trendAnalysis };
}


function createVisitTrendChart(visitKeys, visitDetails) {
  // Get the canvas element
  const visitTrendCanvas = document.getElementById('visitTrendChart');
  const ctx = visitTrendCanvas.getContext('2d');

  // Extract the vital signs data from the visitDetails
  const vitalSignsData = visitKeys.map((visitKey) => {
    const visitData = visitDetails[visitKey];
    return {
      date: formatDate(visitData.timestamp),
      temperature: visitData.temperature,
      bp: visitData.bp,
      rr: visitData.rr,
      hr: visitData.hr,
      sp02: visitData.sp02,
      wt: visitData.wt,
      ht: visitData.ht,
      bmi: visitData.bmi,
      muac: visitData.muac
    };
  });

  // Separate the data for each vital sign
  const dates = vitalSignsData.map((data) => data.date);
  const temperatures = vitalSignsData.map((data) => data.temperature);
  const respiratoryRates = vitalSignsData.map((data) => data.rr);
  const heartRates = vitalSignsData.map((data) => data.hr);
  const spO2Values = vitalSignsData.map((data) => data.sp02);
  const weightValues = vitalSignsData.map((data) => data.wt); // Assuming wt is weight

  // Destroy the previous chart instance if it exists
  destroyChart();

  // Reverse the data arrays to show the trend from left to right
  temperatures.reverse();
  respiratoryRates.reverse();
  heartRates.reverse();
  spO2Values.reverse();
  weightValues.reverse();  // Reverse the weight data array
  const { trendAnalysis } = analyzeAndProvideRecommendations(temperatures, respiratoryRates, heartRates, spO2Values, vitalSignsData);


  // Create the line chart
  window.visitTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.reverse(),
      datasets: [
        {
          label: 'Temperature (&deg;C)',
          data: temperatures,
          borderColor: 'red',
          fill: false
        },
        {
          label: 'Respiratory Rate',
          data: respiratoryRates,
          borderColor: 'green',
          fill: false
        },
        {
          label: 'Heart Rate',
          data: heartRates,
          borderColor: 'purple',
          fill: false
        },
        {
          label: 'SpO2 (%)',
          data: spO2Values,
          borderColor: 'orange',
          fill: false
        },
        {
          label: 'Weight (kg)',
          data: weightValues,
          borderColor: 'blue', // Adjust the color as needed
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  });


  // Display the trend analysis and recommendations in a div
  const trendAnalysisDiv = document.getElementById('trendAnalysisDiv');
  trendAnalysisDiv.innerHTML = `
    <h3>Trend Analysis:</h3>
    <p>${trendAnalysis}</p>

  `;

}


// Rest of the code remains the same
// ...


// Variable to store the current patient's name
let currentPatientName = patient.name;
/*
// Get the button element and add the click event listener
const visitButton = document.getElementById('visit');
const visitPopupOverlay = document.getElementById('popup-overlay3');

visitButton.addEventListener('click', (event) => {
  currentPatientName = event.target.getAttribute('data-patient'); // Extract the patient's name from the data-patient attribute
  visitPopupOverlay.style.display = 'block';
  // Update the isPopupOpen variable to true when the popup is opened
  isPopupOpen = true;
});


// Event listener for the "Save Visit" button (Moved outside other functions)
const saveVisitBtn = document.getElementById('saveVisitBtn');
saveVisitBtn.addEventListener('click', () => {
  // Get the values of the input fields
  const clinicianName = clinicianNameSelect.value;
  const temperature = document.getElementById('temperature').value;
  const bp = document.getElementById('bp').value;
  const rr = document.getElementById('rr').value;
  const hr = document.getElementById('hr').value;
  const sp02 = document.getElementById('sp02').value;
  const wt = document.getElementById('wt').value;
  const ht = document.getElementById('ht').value;
  const bmi = document.getElementById('bmi').value;
  const muac = document.getElementById('muac').value;
  const weightForAgeZScore = document.getElementById('weightForAgeZScore').value;
  const disability = document.getElementById('disability').value;
  const chronicIllness = document.getElementById('chronicIllness').value;
  const drugAbuse = document.getElementById('drugAbuse').value;
  const selectedAllergies = [...testsTakenSelect.selectedOptions].map(option => option.value);

  // Construct the visit object
  const visit = {
    clinicianName,
    temperature,
    bp,
    rr,
    hr,
    sp02,
    wt,
    ht,
    bmi,
    muac,
    weightForAgeZScore,
    disability,
    chronicIllness,
    drugAbuse,
    allergies: selectedAllergies,
    timestamp: Date.now()
  };

  // Push the visit to the "visits" node under the patient
  const visitsRef = ref(database, `patients/${currentPatientName}/visits`);
    push(visitsRef, visit)
    .then(() => {
      showMessage('Visit saved successfully!');
      // Clear the input fields after saving
      clinicianNameSelect.value = '';
      document.getElementById('temperature').value = '';
      document.getElementById('bp').value = '';
      document.getElementById('rr').value = '';
      document.getElementById('hr').value = '';
      document.getElementById('sp02').value = '';
      document.getElementById('wt').value = '';
      document.getElementById('ht').value = '';
      document.getElementById('bmi').value = '';
      document.getElementById('muac').value = '';
      document.getElementById('weightForAgeZScore').value = '';
      document.getElementById('disability').value = '';
      document.getElementById('chronicIllness').value = '';
      document.getElementById('drugAbuse').value = '';
      $('#allergies').val(null).trigger('change'); // Reset the Select2 multiple select
    })
    .catch((error) => {
      console.error('Error saving visit:', error);
    });

   closePopup();
});
*/


// Get the button element and add the click event listener
const triageButton = document.getElementById('triageButton');
triageButton.addEventListener('click', () => {
  displayVisitsPopup(patientName);
});





  function createRecordElement(recordKey, record) {
    const recordElement = document.createElement('div');
recordElement.classList.add('record');

const recordKeyElement = document.createElement('h4');
recordKeyElement.textContent = 'Record Key: ' + recordKey;
recordElement.appendChild(recordKeyElement);

const table = document.createElement('table');
recordElement.appendChild(table);

// Create record key row
const recordKeyRow = document.createElement('tr');
table.appendChild(recordKeyRow);

const recordKeyHeader = document.createElement('th');
recordKeyHeader.textContent = 'Record Key';
recordKeyRow.appendChild(recordKeyHeader);

const recordKeyData = document.createElement('td');
recordKeyData.textContent = recordKey;
recordKeyRow.appendChild(recordKeyData);


// Add this line at the beginning of your code to store the prices data
const pricesData = {};
// Create a button for uploading consumables and sundries prices
const uploadPricesButton = document.createElement('button');
uploadPricesButton.textContent = ' + Prices';
uploadPricesButton.classList.add('upload-prices-button');

// Add event listener to the upload prices button
uploadPricesButton.addEventListener('click', () => {
  // Get the current record key
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay3');

  const popup = document.createElement('div');
  popup.classList.add('popup3');

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('close-button');

  const heading = document.createElement('h2');
  heading.textContent = 'Upload Medical Consumables & Sundries Prices';
  popup.appendChild(closeButton);
  popup.appendChild(heading);

  // Create a form to input the prices
  const pricesForm = document.createElement('form');
  pricesForm.id = 'pricesForm';

  // Input field for consumables price
  const consumablesLabel = document.createElement('label');
  consumablesLabel.textContent = 'Consumables Price (UGX):';
  const consumablesInput = document.createElement('input');
  consumablesInput.type = 'number';
  consumablesInput.name = 'consumablesPrice';
  consumablesInput.required = true;
  consumablesLabel.appendChild(consumablesInput);

  // Input field for sundries price
  const sundriesLabel = document.createElement('label');
  sundriesLabel.textContent = 'Sundries Price (UGX):';
  const sundriesInput = document.createElement('input');
  sundriesInput.type = 'number';
  sundriesInput.name = 'sundriesPrice';
  sundriesInput.required = true;
  sundriesLabel.appendChild(sundriesInput);

  // Submit button for the form
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Upload';
  submitButton.classList.add('upload-button');

  pricesForm.appendChild(consumablesLabel);
  pricesForm.appendChild(sundriesLabel);
  pricesForm.appendChild(submitButton);

  popup.appendChild(pricesForm);

  // Append the overlay and popup to the document body
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Show the overlay and popup
  overlay.style.display = 'block';
  popup.style.display = 'block';

  // Close button event listener
  closeButton.addEventListener('click', () => {
    // Hide the overlay and popup
    overlay.style.display = 'none';
    popup.style.display = 'none';
  });

  // Form submit event listener
  pricesForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(pricesForm);
    const consumablesPrice = formData.get('consumablesPrice');
    const sundriesPrice = formData.get('sundriesPrice');

    // Save the consumables and sundries data to Firebase under the exact test record
    saveConsumablesAndSundriesData(recordKey, consumablesPrice, sundriesPrice);

    // Hide the overlay and popup
    overlay.style.display = 'none';
    popup.style.display = 'none';
  });
});

function saveConsumablesAndSundriesData(recordKey, consumablesPrice, sundriesPrice) {
  // Save the consumablesPrice and sundriesPrice to the data object under the current record key
  const data = {
    consumablesPrice: parseFloat(consumablesPrice),
    sundriesPrice: parseFloat(sundriesPrice),
    dateUploaded: new Date().toLocaleString(),
  };

  // Save the data to Firebase under the exact test record
  const testRecordRef = ref(database, `patients/${patient.patientId}/testsTaken/${recordKey}`);
  update(testRecordRef, { consumablesAndSundries: data })
    .then(() => {
      showMessage('Consumables and Sundries data saved successfully!');
    })
    .catch((error) => {
      console.error('Error saving consumables and sundries data:', error);
      showMessage('Error saving consumables and sundries data. Please try again.');
    });
}
// --- Date Taken Row ---
const dateTakenRow = document.createElement('tr');
table.appendChild(dateTakenRow);

const dateTakenHeader = document.createElement('th');
dateTakenHeader.textContent = 'Date Taken';
dateTakenRow.appendChild(dateTakenHeader);

const dateTakenElement = document.createElement('td');
const dateTaken = record.dateTaken ? new Date(parseInt(record.dateTaken)) : null;
dateTakenElement.textContent = dateTaken && !isNaN(dateTaken.getTime())
  ? dateTaken.toLocaleString()
  : 'Invalid Date';
dateTakenRow.appendChild(dateTakenElement);

// --- Selected Items Row (optional) ---
if (record.selectedItems && Array.isArray(record.selectedItems) && record.selectedItems.length > 0) {
  const itemsRow = document.createElement('tr');
  table.appendChild(itemsRow);

  const itemsHeader = document.createElement('th');
  itemsHeader.textContent = 'Selected Services';
  itemsRow.appendChild(itemsHeader);

  const itemsElement = document.createElement('td');
  itemsElement.textContent = record.selectedItems.join(', ');
  itemsRow.appendChild(itemsElement);
}
const adminPassword = 'sanyu44'; // 🔒 change this to your actual password
const recordRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);
// --- CREATE REMOVABLE ITEM LIST ---
function createRemovableList(items, category, type) {
  return items
    .map((item, index) => {
      const id = `${type}-${category}-${index}`;
      return `
        <div class="removable-item" id="${id}" 
          style="margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 2px;">
          <span>${item.name} - <strong>UGX ${item.amount.toLocaleString()}</strong></span>
          <button class="remove-btn" 
            data-type="${type}" 
            data-category="${category}" 
            data-index="${index}"
            data-name="${item.name}"  
            style="
              background-color: #e63946;
              color: white;
              border: none;
              padding: 2px 6px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              transition: 0.2s;
            "
            onmouseover="this.style.backgroundColor='#d62828'"
            onmouseout="this.style.backgroundColor='#e63946'">
            ✖
          </button>
        </div>`;
    })
    .join('');
}

// --- INVESTIGATIONS ---
const invRow = document.createElement('tr');
table.appendChild(invRow);

const invHeader = document.createElement('th');
invHeader.textContent = 'Investigations';
invRow.appendChild(invHeader);

const invElement = document.createElement('td');

if (record.investigationsTaken && record.investigationsTaken.length > 0) {
  const grouped = {};
  record.investigationsTaken.forEach(i => {
    if (!grouped[i.category]) grouped[i.category] = [];
    grouped[i.category].push(i);
  });

  invElement.innerHTML = Object.entries(grouped)
    .map(([cat, items]) => `<strong>${cat}</strong><br>${createRemovableList(items, cat, 'investigation')}`)
    .join('<br><br>');
} else {
  invElement.textContent = '-- Select Investigation --';
}
invRow.appendChild(invElement);

// --- PROCEDURES ---
const procRow = document.createElement('tr');
table.appendChild(procRow);

const procHeader = document.createElement('th');
procHeader.textContent = 'Procedures';
procRow.appendChild(procHeader);

const procElement = document.createElement('td');

if (record.proceduresTaken && record.proceduresTaken.length > 0) {
  const grouped = {};
  record.proceduresTaken.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  procElement.innerHTML = Object.entries(grouped)
    .map(([cat, items]) => `<strong>${cat}</strong><br>${createRemovableList(items, cat, 'procedure')}`)
    .join('<br><br>');
} else {
  procElement.textContent = '-- Select Procedure --';
}
procRow.appendChild(procElement);

// --- SERVICES ---
const servicesRow = document.createElement('tr');
table.appendChild(servicesRow);

const servicesHeader = document.createElement('th');
servicesHeader.textContent = 'Services';
servicesRow.appendChild(servicesHeader);

const servicesElement = document.createElement('td');

if (record.servicesTaken && record.servicesTaken.length > 0) {
  const grouped = {};
  record.servicesTaken.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  servicesElement.innerHTML = Object.entries(grouped)
    .map(([cat, items]) => `<strong>${cat}</strong><br>${createRemovableList(items, cat, 'service')}`)
    .join('<br><br>');
} else {
  servicesElement.textContent = '-- None --';
}
servicesRow.appendChild(servicesElement);

// --- TOTAL AMOUNT ROW ---
const amountRow = document.createElement('tr');
table.appendChild(amountRow);

const amountHeader = document.createElement('th');
amountHeader.textContent = 'Total Amount';
amountRow.appendChild(amountHeader);

const amountElement = document.createElement('td');
const total = record.totalAmount != null ? record.totalAmount : 0;
amountElement.textContent = `UGX ${total.toLocaleString()}`;
amountElement.id = `amount-${recordKey}`; // unique id for later updates
amountRow.appendChild(amountElement);


// --- PASSWORD-PROTECTED REMOVAL + TOTAL UPDATE ---
table.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('remove-btn')) return;

  const entered = prompt('Enter admin password to confirm removal:');
  if (entered !== adminPassword) {
    alert('❌ Incorrect password. Removal cancelled.');
    return;
  }

  const type = e.target.dataset.type; // investigation | procedure | service
  const category = e.target.dataset.category;
  const itemName = e.target.dataset.name; // name of the item
  const recordRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);

  try {
    // 1️⃣ Remove from type array (investigationsTaken / proceduresTaken / servicesTaken)
    const typePath = `${type}sTaken`;
    const itemRef = child(recordRef, typePath);
    const snapshot = await get(itemRef);
    let items = snapshot.val() || [];

    const filteredItems = items.filter(item => !(item.category === category && item.name === itemName));
    await set(itemRef, filteredItems);

    // 2️⃣ Remove from selectedItems
    const selectedRef = child(recordRef, 'selectedItems');
    const selSnap = await get(selectedRef);
    let selectedItems = selSnap.val() || [];
    selectedItems = selectedItems.filter(i => i !== itemName);
    await set(selectedRef, selectedItems);

    // 3️⃣ Recalculate total
    const [invSnap, procSnap, servSnap] = await Promise.all([
      get(child(recordRef, 'investigationsTaken')),
      get(child(recordRef, 'proceduresTaken')),
      get(child(recordRef, 'servicesTaken'))
    ]);

    const totalNew =
      (Object.values(invSnap.val() || {}).reduce((sum, i) => sum + (i.amount || 0), 0)) +
      (Object.values(procSnap.val() || {}).reduce((sum, i) => sum + (i.amount || 0), 0)) +
      (Object.values(servSnap.val() || {}).reduce((sum, i) => sum + (i.amount || 0), 0));

    await update(recordRef, { totalAmount: totalNew });

    // 4️⃣ Update total in UI
    const totalEl = document.getElementById(`amount-${recordKey}`);
    if (totalEl) totalEl.textContent = `UGX ${totalNew.toLocaleString()}`;

    // 5️⃣ Remove visually
    e.target.closest('.removable-item').remove();
    showMessage(`✅ ${itemName} removed successfully!`);
  } catch (error) {
    console.error('Error removing item:', error);
    showMessage('⚠️ Failed to remove item from database.');
  }
});




// Create complaints row
const complaintsRow = document.createElement('tr');
table.appendChild(complaintsRow);

// Create table header for 'Complaints'
const complaintsHeader = document.createElement('th');
complaintsHeader.textContent = 'Patient Complaints';
complaintsRow.appendChild(complaintsHeader);

// Create table cell for 'Complaints'
const complaintsElement = document.createElement('td');
complaintsElement.textContent = record.additionalNotes || 'No complaints';
complaintsRow.appendChild(complaintsElement);

// Optionally, style the complaints element based on the content (if required)
if (!record.additionalNotes) {
  complaintsElement.style.color = 'gray';
} else {
  complaintsElement.style.color = 'black';
}

// --- Create examination row ---
const examinationRow = document.createElement('tr');
table.appendChild(examinationRow);

// Header cell
const examinationHeader = document.createElement('th');
examinationHeader.textContent = 'Examination';
examinationRow.appendChild(examinationHeader);

// Table cell for detailed examination
const examinationElement = document.createElement('td');

if (record.examination && typeof record.examination === 'object') {
  const examData = record.examination;
  const examContainer = document.createElement('div');
  examContainer.style.display = 'flex';
  examContainer.style.flexDirection = 'column';
  examContainer.style.gap = '6px';

  for (const [key, value] of Object.entries(examData)) {
    if (value && value.trim() !== '') {
      const fieldDiv = document.createElement('div');
      fieldDiv.style.marginBottom = '3px';

      // Format the label — capitalize & add spaces between words
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/\s+/g, ' ')       // Clean extra spaces
        .replace(/^./, s => s.toUpperCase()); // Capitalize first letter

      const labelSpan = document.createElement('strong');
      labelSpan.textContent = `${formattedKey}: `;
      labelSpan.style.color = '#111';
      labelSpan.style.textTransform = 'capitalize';

      const valueSpan = document.createElement('span');
      valueSpan.textContent = value;

      fieldDiv.appendChild(labelSpan);
      fieldDiv.appendChild(valueSpan);
      examContainer.appendChild(fieldDiv);
    }
  }

  examinationElement.appendChild(examContainer);
} else {
  examinationElement.textContent = record.examination || 'No examination found';
}

examinationRow.appendChild(examinationElement);




// Create payment status row
const paymentStatusRow = document.createElement('tr');
table.appendChild(paymentStatusRow);

const paymentStatusHeader = document.createElement('th');
paymentStatusHeader.textContent = 'Services Payment';
paymentStatusRow.appendChild(paymentStatusHeader);

const paymentStatusElement = document.createElement('td');
paymentStatusElement.textContent = record.paymentstatus || 'Not Paid';
paymentStatusRow.appendChild(paymentStatusElement);

if (record.paymentstatus !== 'payment received') {
  paymentStatusElement.style.color = 'red';
} else {
  paymentStatusElement.style.color = 'blue';
}

// Create medicine payment status row
const medicineStatusRow = document.createElement('tr');
table.appendChild(medicineStatusRow);

const medicineStatusHeader = document.createElement('th');
medicineStatusHeader.textContent = 'Medicine Payment';
medicineStatusRow.appendChild(medicineStatusHeader);

const medicineStatusData = document.createElement('td');
medicineStatusData.textContent = record.medicinestatus || 'Not Paid';
medicineStatusRow.appendChild(medicineStatusData);

if (record.medicinestatus !== 'payment received') {
  medicineStatusData.style.color = 'red';
} else {
  medicineStatusData.style.color = 'blue';
}


  // Create results obtained row
  const resultsObtainedRow = document.createElement('tr');
  table.appendChild(resultsObtainedRow);

  const resultsObtainedHeader = document.createElement('th');
  resultsObtainedHeader.textContent = 'Test Results status ';
  resultsObtainedRow.appendChild(resultsObtainedHeader);

  const resultsObtainedElement = document.createElement('td');
  resultsObtainedElement.textContent = record.results?.resultsObtained || 'Pending...';
  resultsObtainedElement.classList.add('results-obtained-data'); // Add a class name to the results obtained cell
  if (record.results && record.results.resultsObtained === 'Completed Successfully') {
    resultsObtainedElement.style.color = 'darkblue';
  } else {
    resultsObtainedElement.style.color = 'orange';
  }
  resultsObtainedRow.appendChild(resultsObtainedElement);


// Create additional notes row
const additionalNotesRow = document.createElement('tr');
table.appendChild(additionalNotesRow);

// Create the header cell for Diagnosis
const additionalNotesHeader = document.createElement('th');
additionalNotesHeader.textContent = 'Diagnosis';
additionalNotesRow.appendChild(additionalNotesHeader);

// Create the content cell for Diagnosis
const additionalNotesElement = document.createElement('td');
additionalNotesElement.textContent = record.results?.additionalNotes || 'Pending...';
if (record.results && !record.results.additionalNotes) {
  additionalNotesElement.classList.add('pending');
}
additionalNotesRow.appendChild(additionalNotesElement);

// Create a cell for the edit button
const editButtonCell = document.createElement('td');
const editButton = document.createElement('button');
editButton.classList.add('edit-button'); // Optional: Add a CSS class for styling

// Create a span for the Font Awesome icon
const editIcon = document.createElement('span');
editIcon.classList.add('fas', 'fa-edit'); // Add the Font Awesome classes for the edit icon

// Append the icon to the button
editButton.appendChild(editIcon);

// Assuming you have a predefined password
const predefinedPassword = "sanyu44"; // Change this to your actual password

editButton.addEventListener('click', function() {
  // Prompt for the password
  const enteredPassword = prompt('Please enter your password to edit the diagnosis:');
  
  // Check if the password is correct
  if (enteredPassword === predefinedPassword) {
    // Password is correct; allow editing of the diagnosis
    const newDiagnosis = prompt('Edit Diagnosis:', additionalNotesElement.textContent);
    
    if (newDiagnosis !== null) {
      additionalNotesElement.textContent = newDiagnosis;

      // Update the record object
      record.results.additionalNotes = newDiagnosis;

      // Reference to the additional notes in Firebase
      const additionalNotesRef = ref(database, `patients/${patient.patientId}/testsTaken/${recordKey}/results/additionalNotes`);

      // Update the additional notes in Firebase
      set(additionalNotesRef, newDiagnosis)
        .then(() => {
          showMessage('Diagnosis updated successfully!');
        })
        .catch((error) => {
          showMessage('Error updating diagnosis:', error);
        });
    }
  } else {
    // Password is incorrect; show an error message
    showMessage('Incorrect password. You cannot edit the diagnosis.');
  }
});


// Append the edit button to the button cell and row
editButtonCell.appendChild(editButton);
additionalNotesRow.appendChild(editButtonCell);




// Create final status row
const finalStatusRow = document.createElement('tr');
table.appendChild(finalStatusRow);

const finalStatusHeader = document.createElement('th');
finalStatusHeader.textContent = 'Final Status of Patient';
finalStatusRow.appendChild(finalStatusHeader);

const finalStatusData = document.createElement('td');
finalStatusData.textContent = record.results?.finalStatus || 'Pending...';
finalStatusRow.appendChild(finalStatusData);

// Create follow-up date/time row
const followUpRow = document.createElement('tr');
table.appendChild(followUpRow);

const followUpHeader = document.createElement('th');
followUpHeader.textContent = 'Follow-up Date/Time';
followUpRow.appendChild(followUpHeader);

const followUpData = document.createElement('td');
followUpData.textContent = record.results?.followUpDateTime || 'none';
followUpRow.appendChild(followUpData);

// Create a row for the consumables price
const consumablesRow = document.createElement('tr');
  table.appendChild(consumablesRow);

  const consumablesPriceHeader = document.createElement('th');
  consumablesPriceHeader.textContent = 'Consumables Price (UGX)';
  consumablesRow.appendChild(consumablesPriceHeader);

  // Check if consumables price data exists for the current record key and the nested node
  if (record.hasOwnProperty('consumablesAndSundries')) {
    const consumablesPriceData = record.consumablesAndSundries.consumablesPrice.toLocaleString('en-US', {    style: 'currency',   currency: 'UGX',  });

    const consumablesPriceDataCell = document.createElement('td');
    consumablesPriceDataCell.textContent = consumablesPriceData;
    consumablesRow.appendChild(consumablesPriceDataCell);
  } else {
    // If consumables price data not found, display "Not Found" in the table cell
    const noConsumablesDataCell = document.createElement('td');
    noConsumablesDataCell.textContent = 'Not Found';
    consumablesRow.appendChild(noConsumablesDataCell);
  }

  // Create a row for the sundries price
  const sundriesRow = document.createElement('tr');
  table.appendChild(sundriesRow);

  const sundriesPriceHeader = document.createElement('th');
  sundriesPriceHeader.textContent = 'Sundries Price (UGX)';
  sundriesRow.appendChild(sundriesPriceHeader);

  // Check if sundries price data exists for the current record key and the nested node
  if (record.hasOwnProperty('consumablesAndSundries')) {
    const sundriesPriceData = record.consumablesAndSundries.sundriesPrice.toLocaleString('en-US', {    style: 'currency',   currency: 'UGX',  });

    const sundriesPriceDataCell = document.createElement('td');
    sundriesPriceDataCell.textContent = sundriesPriceData;
    sundriesRow.appendChild(sundriesPriceDataCell);
  } else {
    // If sundries price data not found, display "Not Found" in the table cell
    const noSundriesDataCell = document.createElement('td');
    noSundriesDataCell.textContent = 'Not Found';
    sundriesRow.appendChild(noSundriesDataCell);
  }


// Declare totalDataCell and totalCostCell variables
let totalDataCell;
let totalCostCell;

// Create a row for the treatment total
const treatmentTotalRow = document.createElement('tr');
const totalHeader = document.createElement('th');
totalHeader.textContent = 'Treatment Total (UGX)';
treatmentTotalRow.appendChild(totalHeader);

// Calculate the treatment total by adding consumables and sundries prices
if (record.hasOwnProperty('consumablesAndSundries')) {
    const consumablesPrice = record.consumablesAndSundries.consumablesPrice;
    const sundriesPrice = record.consumablesAndSundries.sundriesPrice;
    const treatmentTotal = consumablesPrice + sundriesPrice;

    totalDataCell = document.createElement('td');
    totalDataCell.textContent = 'UGX ' + treatmentTotal.toFixed(2); // Use toFixed(2) to ensure two decimal places
    treatmentTotalRow.appendChild(totalDataCell);

    // Update treatmentTotal1
    // Get the treatment total from the first element
    const treatmentTotal1 = parseFloat(totalDataCell.textContent.replace('UGX', ''));
    //console.log(treatmentTotal1)
} else {
    // If consumables and sundries price data not found, display "Not Found" in the table cell
    const noTotalDataCell = document.createElement('td');
    noTotalDataCell.textContent = 'Not Found';
    treatmentTotalRow.appendChild(noTotalDataCell);
}

// Append the treatment total row to the table
table.appendChild(treatmentTotalRow);

// Predefined password for authorization
const Password = "sanyu44"; // Change this to your actual password

// Create Finnish button
const finnishButton = document.createElement('button');
finnishButton.textContent = '+ Add Prescription';
finnishButton.classList.add('finnish-button');


// Retrieve the addMedicationForm element
const addMedicationForm = document.getElementById('addMedicationForm');

// Handle button click to either ask for a password or directly open the popup
finnishButton.addEventListener('click', () => {
  // Check if the medication table has any rows besides the header
  //const medicationRows = medicationTable.querySelectorAll('tr');
  
  if (totalCost <= 0) {
    // Table is empty (only the header row exists), open the popup without asking for the password
    openPopup();
  } else {
    // Table has medication data, prompt for the password
    const enteredPassword = prompt('Please enter your password to add Medicine & Prescription:');
    
    // Check if the password is correct
    if (enteredPassword === Password) {
      // Password is correct; open the popup
      openPopup();
    } else {
      // Password is incorrect; show an error message
      showMessage('Incorrect password. You cannot add Medicine & Prescription.');
    }
  }
});


// Create a div element for medication taken
const medicationTakenElement = document.createElement('div');
medicationTakenElement.classList.add('medication-taken');
const medicationTable = document.createElement('table');
medicationTable.classList.add('medication-table');

// Create table header row
const tableHeaderRow = document.createElement('tr');
const headers = ['Medication', 'Prescription', 'Pieces', 'Cost', 'Actions'];
headers.forEach((headerText) => {
    const tableHeaderCell = document.createElement('th');
    tableHeaderCell.textContent = headerText;
    tableHeaderRow.appendChild(tableHeaderCell);
});
medicationTable.appendChild(tableHeaderRow);

let totalCost = 0; // Initialize totalCost variable

// Check if medication data exists and create rows
if (record.results && record.results.medication) {
    const medicationNodes = record.results.medication;

    // Log medication nodes for debugging
    console.log('Medication Data:', medicationNodes);

    Object.keys(medicationNodes).forEach((medicationKey) => {
        const medicationData = medicationNodes[medicationKey];

        // Log each medication data for debugging
        console.log('Medication Data for Key:', medicationKey, medicationData);

        const tableRow = document.createElement('tr');

        // Medication data cells
        const medicationCell = document.createElement('td');
        medicationCell.textContent = medicationData.medication;
        const prescriptionCell = document.createElement('td');
        prescriptionCell.textContent = medicationData.prescription;
        const gramsCell = document.createElement('td');
        gramsCell.textContent = medicationData.grams;
        const totalCostCell = document.createElement('td');
        totalCostCell.textContent = medicationData.totalCost;

        // Create "Actions" cell
        const actionsCell = document.createElement('td');

        // Create "Edit" button
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button'); // Optional: Add a CSS class for styling

        // Create a span for the Font Awesome edit icon
        const editIcon = document.createElement('span');
        editIcon.classList.add('fas', 'fa-edit'); // Add the Font Awesome classes for the edit icon

        // Append the icon to the button
        editButton.appendChild(editIcon);
        editButton.addEventListener('click', () => {
          handleEditMedication(medicationData, recordKey, medicationKey);
        });

        // Create "Delete" button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button'); // Optional: Add a CSS class for styling

        // Create a span for the Font Awesome delete icon
        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('fas', 'fa-trash'); // Add the Font Awesome classes for the delete icon

        // Append the icon to the button
        deleteButton.appendChild(deleteIcon);
        deleteButton.addEventListener('click', () => {
          handleDeleteMedication(medicationKey, tableRow);
        });

        // Append both buttons to the actions cell
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        // Append all cells to the row
        tableRow.appendChild(medicationCell);
        tableRow.appendChild(prescriptionCell);
        tableRow.appendChild(gramsCell);
        tableRow.appendChild(totalCostCell);
        tableRow.appendChild(actionsCell); // Append the Actions cell with both buttons

        medicationTable.appendChild(tableRow);

        // Add to total cost
        totalCost += parseFloat(medicationData.totalCost); // Add the total cost to the variable
    });
} else {
    console.log('No medication data found in record:', record);
}

// Append the medication table to the div
medicationTakenElement.appendChild(medicationTable);

// Append the div to the record element
recordElement.appendChild(medicationTakenElement);

// Debugging: Ensure the table is visible
console.log('Medication Table:', medicationTable);






// Function to create and display the edit modal
function handleEditMedication(medicationData, recordKey, medicationKey) {
  console.log('Editing medication:', medicationData, 'with key:', medicationKey);
  // Create the modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.classList.add('modal-overlay');

  // Create the modal container
  const modal = document.createElement('div');
  modal.classList.add('modal5');

  // Create modal header
  const modalHeader = document.createElement('h2');
  modalHeader.textContent = 'Edit Medication';
  modal.appendChild(modalHeader);

  // Create form fields for each editable property
  const medicationInput = createInputField('Medication', medicationData.medication);
  const prescriptionInput = createInputField('Prescription', medicationData.prescription);
  const piecesInput = createInputField('Pieces', medicationData.grams);
  const costInput = createInputField('Cost', medicationData.totalCost);

  modal.appendChild(medicationInput.container);
  modal.appendChild(prescriptionInput.container);
  modal.appendChild(piecesInput.container);
  modal.appendChild(costInput.container);
// Create "Save" button
const saveButton = document.createElement('button');
saveButton.textContent = 'Save';
saveButton.classList.add('save-button');

saveButton.addEventListener('click', async () => {
    // Step 1: Ask for password before saving
    const enteredPassword = prompt('Please enter your password to confirm changes:');

    // Replace 'yourPassword' with the actual password you want to validate
    const correctPassword = 'sanyu44'; // This should be securely handled in real applications

    if (enteredPassword !== correctPassword) {
        showMessage('Incorrect password. Changes were not saved.');
        return; // Stop the save process if password is incorrect
    }

    // If password is correct, proceed with the save operation
    try {
        // Get updated values from input fields
        const updatedMedication = medicationInput.input.value.trim();
        const updatedPrescription = prescriptionInput.input.value.trim();
        const updatedGrams = piecesInput.input.value.trim();
        const updatedTotalCost = costInput.input.value.trim();

        // Validate that no field is undefined or empty
        if (!updatedMedication || !updatedPrescription || !updatedGrams || !updatedTotalCost) {
            throw new Error('All fields must be filled.');
        }

        // Save the updated values to medicationData
        medicationData.medication = updatedMedication;
        medicationData.prescription = updatedPrescription;
        medicationData.grams = updatedGrams;
        medicationData.totalCost = updatedTotalCost;

        // Reference to the specific medication in Firebase
        const medicationRef = ref(database, `patients/${patient.patientId}/testsTaken/${recordKey}/results/medication/${medicationKey}`);

        // Update the medication data in Firebase
        await update(medicationRef, {
            medication: updatedMedication,
            prescription: updatedPrescription,
            grams: updatedGrams,
            totalCost: updatedTotalCost
        });

        // Update the UI and medication data locally
        updateMedicationRow(recordKey, medicationData);

        // Close the modal after saving
        closeModal(modalOverlay);

        showMessage('Medication updated successfully');
    } catch (error) {
        showMessage('Error updating medication: ' + error.message);
        console.error('Error:', error);
    }
});



  // Create "Close" button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.classList.add('close-button');
  closeButton.addEventListener('click', () => {
      closeModal(modalOverlay); // Close the modal without saving
  });

  // Append buttons to the modal
  modal.appendChild(saveButton);
  modal.appendChild(closeButton);

  // Append modal to the overlay and then to the body
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
}

// Helper function to create an input field with a label
function createInputField(labelText, value) {
  const container = document.createElement('div');
  container.classList.add('input-field');

  const label = document.createElement('label');
  label.textContent = labelText;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;

  container.appendChild(label);
  container.appendChild(input);

  return { container, input };
}

// Function to close the modal
function closeModal(modalOverlay) {
  document.body.removeChild(modalOverlay);
}

// Function to update the medication row after editing
function updateMedicationRow(medicationKey, medicationData) {
  // Find the row in the table corresponding to the medicationKey and update the values
  const rows = document.querySelectorAll('.medication-table tr');
  rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0 && cells[0].textContent === medicationData.medication) {
          cells[0].textContent = medicationData.medication;
          cells[1].textContent = medicationData.prescription;
          cells[2].textContent = medicationData.grams;
          cells[3].textContent = medicationData.totalCost;
      }
  });
}


// Function to handle the "Delete" button click
function handleDeleteMedication(medicationKey, tableRow) {
  // Prompt user for a password
  const password = prompt('Please enter the password to delete this medication:');

  // Check if the password is correct (replace 'yourPassword' with the actual password)
  const correctPassword = 'sanyu44'; // Define your actual password here
  if (password === correctPassword) {
      const confirmed = confirm('Are you sure you want to delete this medication?');
      if (confirmed) {
          // Reference to the specific medication in Firebase
          const medicationRef = ref(database, `patients/${patient.patientId}/testsTaken/${recordKey}/results/medication/${medicationKey}`);

          // Remove the medication data from Firebase
          remove(medicationRef)
              .then(() => {
                  // Logic to delete medication data from the local record object
                  delete record.results.medication[medicationKey];

                  // Remove the table row from the DOM
                  tableRow.remove();

                  console.log(`Deleted medication with key: ${medicationKey} from Firebase.`);
                  showMessage('Medication deleted successfully');
              })
              .catch((error) => {
                  console.error('Error deleting medication from Firebase:', error);
                  showMessage('Error deleting medication:', error);
              });
      }
  } else {
      alert('Incorrect password. Deletion canceled.');
  }
}


// Create the total element row
const totalRow = document.createElement('tr');
const emptyCell = document.createElement('td');
emptyCell.setAttribute('colspan', '3');
totalRow.appendChild(emptyCell);

// Create total cost cell
totalCostCell = document.createElement('td');
totalCostCell.textContent = 'Total Cost: UGX ' + totalCost.toFixed(2);
totalCostCell.classList.add('total-cell'); // Add the CSS class\

totalRow.appendChild(totalCostCell);

// Append the total row to the medication table
medicationTable.appendChild(totalRow);

// Assuming recordData.totalAmount is already calculated
let treatmentTotal1 = record.totalAmount || 0;

console.log(treatmentTotal1); // numeric value, ready to use


// Extract numeric value from totalCostCell.textContent
let treatmentTotal2 = 0;
const totalCostText = totalCostCell.textContent.replace('Total Cost: UGX', '').trim();
if (totalCostText) {
    treatmentTotal2 = parseFloat(totalCostText);
}

// Log treatmentTotal2 and treatmentTotal1 after they are initialized
console.log('Treatment 2:', treatmentTotal2);
console.log('Treatment 1:', treatmentTotal1);

// Check if treatmentTotal2 is a valid number after parsing
if (!isNaN(treatmentTotal2)) {
    // Successfully parsed treatmentTotal2, proceed with calculations
    // Calculate the overall total by summing up the totals from both elements
    const overallTotal = treatmentTotal1 + treatmentTotal2;
    console.log('Overall Total:', overallTotal);

    // Display the overall total
    const overallTotalSpan = document.createElement('span');
    overallTotalSpan.textContent = 'Overall Total: UGX ' + overallTotal.toFixed(2);
    overallTotalSpan.classList.add('overall-total'); // Add the CSS class

    // Append the overall total to the document body or any desired location
    medicationTable.appendChild(overallTotalSpan);
} else {
    // Failed to parse treatmentTotal2, handle the error
    console.log('Failed to parse treatmentTotal2:', totalCostText);
}



// Create share button
const shareButton = document.createElement('button');
shareButton.id = 'shareButton';
shareButton.innerHTML = '<i class="fa fa-paper-plane"></i>Lab Request'; // Use innerHTML instead of textContent
shareButton.addEventListener('click', () => {
    shareRecord(patient, record);

});

// Append the share button to the record element
recordElement.appendChild(shareButton);



function shareRecord(patient, record) {
  // Get the patient's name, doctor's username, and the test key
  const patientName = patient.name;
  const testKey = recordKey;

  // Construct the notification message
  const message = `New Test ${testKey} for patient ${patientName} to be done.`;

  // Construct the message object
  const notification = {
    timestamp: Date.now(),
    message: message
  };

  // Update the chat node in Firebase with the notification
  const chatRef = ref(database, 'laboratory-requests');
  push(chatRef, notification)
    .then(() => {
      console.log('Notification sent successfully!');
      showMessage('Notification sent successfully!');
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
      showMessage('Error sending notification:', error);
    });
}





// Define visitKeys at a higher scope to make it accessible to both functions
let visitKeys = [];
let visitDetails = {};

// Function to display the patient's visit details
function displayPatientVisitDetails(visitKeys, visitDetails, latestVisitData) {
  const patientVisitDetailsDiv = document.getElementById('patientVisitDetails');
  patientVisitDetailsDiv.innerHTML = '';

  if (latestVisitData) {
    // Get the visit count
    const visitCount = visitKeys.length;

    // Display the visit count in the "Visit Count" element
    const visitCountElement = document.getElementById('visitCount');
    visitCountElement.textContent = visitCount;

    // Create the visit element for the latest visit
    const visitElement = document.createElement('div');

    // Add the visit details to the visit element
    visitElement.innerHTML = `
    <h3>LATEST VISIT TRIAGE:</h3>
    <div class="visit-details-container">
      <p><b>Date:</b> ${formatDate(latestVisitData.timestamp)}</p>
      <p><b>Clinician's Name:</b> ${latestVisitData.clinicianName || 'N/D'}</p>
      <p><b>Temperature:</b> ${latestVisitData.temperature || 'N/D'} &deg;C</p>
      <p><b>BP:</b> ${latestVisitData.bp || 'N/D'} (mmHg)</p>
      <p><b>RR:</b> ${latestVisitData.rr || 'N/D'}</p>
      <p><b>HR:</b> ${latestVisitData.hr || 'N/D'}</p>
      <p><b>SpO2:</b> ${latestVisitData.sp02 || 'N/D'} (%)</p>
      <p><b>WT:</b> ${latestVisitData.wt || 'N/D'} (Kg)</p>
      <p><b>HT:</b> ${latestVisitData.ht || 'N/D'} (Cm)</p>
      <p><b>BMI:</b> ${latestVisitData.bmi || 'N/D'}</p>
      <p><b>MUAC:</b> ${latestVisitData.muac || 'N/D'}</p>
      <p><b>Weight for Age Z score:</b> ${latestVisitData.weightForAgeZScore || 'N/D'} (Kg)</p>
      <p><b>Disability:</b> ${latestVisitData.disability || 'N/D'}</p>
      <p><b>Known Chronic Illness:</b> ${latestVisitData.chronicIllness || 'N/D'}</p>
      <p><b>Any Drug Abuse:</b> ${latestVisitData.drugAbuse || 'N/D'}</p>
      <p><b>Allergies:</b> ${latestVisitData.allergies && latestVisitData.allergies.length > 0
        ? latestVisitData.allergies.join(', ')
        : 'N/D'}
      </p>
    </div>
    <hr>
    `;

    patientVisitDetailsDiv.appendChild(visitElement);
  } else {
    patientVisitDetailsDiv.textContent = 'No visit details found.';
    patientVisitDetailsDiv.style.fontStyle = 'italic';
  }
}
// Function to get patient details
function getPatientDetails(patientName) {
  const patientRef = ref(database, `patients/${patientName}`);
  return get(patientRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('Error fetching patient details:', error);
      return null;
    });
}

// Function to get the latest visit data for a patient
function getLatestVisitData(patientName) {
  const visitsRef = ref(database, `patients/${patientName}/visits`);
  return get(visitsRef)
    .then((snapshot) => {
      const visitDetails = snapshot.val();
      if (visitDetails) {
        // Get the visit keys and sort them in descending order based on timestamp
        const visitKeys = Object.keys(visitDetails).sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

        // Get the latest visit data if available
        const latestVisitKey = visitKeys[0];
        const latestVisitData = visitDetails[latestVisitKey];
        return latestVisitData;
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('Error fetching latest visit data:', error);
      return null;
    });
}

function getPatientVisitDetails(patientName) {
  const visitsRef = ref(database, `patients/${patientName}/visits`);
  onValue(visitsRef, (snapshot) => {
    const visitDetails = snapshot.val();
    if (visitDetails) {
      // Get the visit keys and sort them in descending order based on timestamp
      visitKeys = Object.keys(visitDetails).sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

      // Get the latest visit data if available
      const latestVisitKey = visitKeys[0];
      const latestVisitData = visitDetails[latestVisitKey];

      // Call the function to display the patient's visit details
      displayPatientVisitDetails(visitKeys, visitDetails, latestVisitData);

      // Call the function to create the chart
      createVisitTrendChart(visitKeys, visitDetails);
    } else {
      displayPatientVisitDetails([], {}); // If no visit details found, display an empty state
      createVisitTrendChart([], {}); // If no visit details found, create an empty chart
    }
  });
}


// Call the function to retrieve and display the patient's visit details
getPatientVisitDetails(patientName);

// Create print button
const printButton = document.createElement('button');
printButton.innerHTML = '<i class="fa fa-print"></i> Print Record';
printButton.classList.add('print-button');

// Add event listener to the print button
printButton.addEventListener('click', async () => {
  // Get the patient details and latest visit data
  const patient = await getPatientDetails(patientName);
  const latestVisitData = await getLatestVisitData(patientName);
// If testsTaken is an object with keys
const recordKey = Object.keys(patient.testsTaken)[0]; // "test1"
printRecord(patient, record, recordKey, visitDetails, latestVisitData);

});

// Append the print button to the record element
recordElement.appendChild(printButton);

async function printRecord(patient, record, recordKey, visitDetails, latestVisitData) {
  window.jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let cursorY = margin;

  const lineHeight = 5;
  const bodyFontSize = 9;
  const headingFontSize = 11;

  // ---------------- Watermark ----------------
  doc.setGState(new doc.GState({ opacity: 0.05 }));
  const watermarkSize = 100;
  doc.addImage('k.jpg', 'PNG', (pageWidth - watermarkSize) / 2, (pageHeight - watermarkSize) / 2, watermarkSize, watermarkSize);
  doc.setGState(new doc.GState({ opacity: 1 }));

  // ---------------- Header ----------------
  doc.addImage('k.jpg', 'PNG', margin, cursorY, 20, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138);
  doc.text('KEAH MEDICAL CENTER', pageWidth / 2 + 10, cursorY + 10, { align: 'center' });
  cursorY += 13;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text('Plot 294 Kevina Road, Nsambya- Kampala', pageWidth / 2 + 10, cursorY + 6, { align: 'center' });
  cursorY += 7;
  doc.text('Tel: +256 782 477 517 | Email: info@keahmedicals.com', pageWidth / 2 + 10, cursorY + 6, { align: 'center' });
  cursorY += 15;

  // ---------------- Outer Box ----------------
  const boxX = margin;
  const boxY = cursorY;
  const boxWidth = pageWidth - 2 * margin;
  const boxHeight = pageHeight - boxY - margin;
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.8);
  doc.rect(boxX, boxY, boxWidth, boxHeight);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(headingFontSize);
  doc.text('Doctor Notes', boxX + boxWidth / 2, boxY + 10, { align: 'center' });

  // ---------------- Top Section ----------------
  const topY = boxY + 18;
  const topHeight = 40;
  const topLeftWidth = boxWidth * 0.5 - 2;
  const topRightWidth = boxWidth * 0.5 - 2;

  doc.line(boxX, topY - 2, boxX + boxWidth, topY - 2);
  doc.line(boxX + boxWidth / 2, topY, boxX + boxWidth / 2, topY + topHeight);

  // Top left: Patient Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(headingFontSize);
  doc.text('Patient Info', boxX + 2, topY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(bodyFontSize);

  let leftY = topY + 12;
  const topLeftInfo = [
    ['Name', patient.name],
    ['Date Of Birth', patient.dob],
    ['KMC', patient.patientId],
  ];
  topLeftInfo.forEach(([k, v]) => {
    const lines = doc.splitTextToSize(`${k}: ${v}`, topLeftWidth - 4);
    lines.forEach(line => {
      doc.text(line, boxX + 2, leftY);
      leftY += lineHeight;
    });
  });

  // Top right: Contact Info
  const rightX = boxX + boxWidth / 2 + 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(headingFontSize);
  doc.text('Contact Info', rightX, topY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(bodyFontSize);

  let rightY = topY + 12;
const topRightInfo = [
  ['Contact', patient.parents || 'N/A'],
  ['Residence', patient.residence || 'N/A'],
  ['Record Key', recordKey || 'N/A'],  // ✅ now shows "test1"
  ['Date Taken', new Date(record.dateTaken).toLocaleString() || 'N/A'],
];

  topRightInfo.forEach(([k, v]) => {
    const lines = doc.splitTextToSize(`${k}: ${v}`, topRightWidth - 4);
    lines.forEach(line => {
      doc.text(line, rightX, rightY);
      rightY += lineHeight;
    });
  });

  // ---------------- Lower Section ----------------
  const sectionPadding = 6;
  const lowerY = topY + topHeight + 5;
  const lowerHeight = boxY + boxHeight - lowerY - 20;
  const lowerLeftWidth = boxWidth * 0.35;
  const lowerRightWidth = boxWidth - lowerLeftWidth - 10;

  doc.line(boxX + lowerLeftWidth + 5, lowerY, boxX + lowerLeftWidth + 5, lowerY + lowerHeight);
  doc.line(boxX, lowerY - 3, boxX + boxWidth, lowerY - 3);

  // ---------------- Lower left: Vitals & Investigations ----------------
  let leftStartY = lowerY + sectionPadding;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(headingFontSize);
  doc.text('Vitals & Investigations', boxX + sectionPadding, leftStartY);
  leftStartY += lineHeight;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(bodyFontSize);

  const vitals = latestVisitData || {};
  const vitalsList = [
    ['Temp', vitals.temperature, '°C'],
    ['BP', vitals.bp, 'mmHg'],
    ['RR', vitals.rr, 'breaths/min'],
    ['HR', vitals.hr, 'bpm'],
    ['SpO₂', vitals.sp02, '%'],
    ['WT', vitals.wt, 'kg'],
    ['HT', vitals.ht, 'cm'],
    ['BMI', vitals.bmi, 'kg/m²'],
    ['MUAC', vitals.muac, 'cm'],
  ];

  let hasVitals = false;
  vitalsList.forEach(([label, value, unit]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'N/D') {
      hasVitals = true;
      const displayText = `${label}: ${value} ${unit || ''}`;
      const lines = doc.splitTextToSize(displayText, lowerLeftWidth - 2 * sectionPadding);
      lines.forEach(line => {
        doc.text(line.trim(), boxX + sectionPadding, leftStartY);
        leftStartY += lineHeight;
      });
    }
  });

  if (!hasVitals) {
    doc.text('No vitals recorded.', boxX + sectionPadding, leftStartY);
  }

  if (record.investigationsTaken?.length > 0) {
    doc.setFont('helvetica', 'bold');
    const invTitle = doc.splitTextToSize('Investigations:', lowerLeftWidth - 2 * sectionPadding);
    invTitle.forEach(line => {
      doc.text(line, boxX + sectionPadding, leftStartY);
      leftStartY += lineHeight;
    });
    doc.setFont('helvetica', 'normal');
    record.investigationsTaken.forEach(inv => {
      const lines = doc.splitTextToSize(`${inv.category}: ${inv.name}`, lowerLeftWidth - 2 * sectionPadding);
      lines.forEach(line => {
        doc.text(line, boxX + sectionPadding, leftStartY);
        leftStartY += lineHeight;
      });
    });
  }
// ---------------- Lower right: Examination, Medications, Results ----------------
const rightStartX = boxX + lowerLeftWidth + 10 + sectionPadding;
let rightStartY = lowerY + sectionPadding;

// 1️⃣ Examination & Notes
doc.setFont('helvetica', 'bold');
doc.setFontSize(headingFontSize);
doc.text('Examination & Notes', rightStartX, rightStartY);
rightStartY += lineHeight;

doc.setFont('helvetica', 'normal');
doc.setFontSize(bodyFontSize);

// --- Format examination for printing ---
let formattedExamination = '—';
if (record.examination && typeof record.examination === 'object') {
  const lines = [];

  for (const [key, value] of Object.entries(record.examination)) {
    if (value && value.trim() !== '') {
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1') // space between words
        .replace(/\s+/g, ' ')       // clean multiple spaces
        .replace(/^./, s => s.toUpperCase()); // capitalize first letter

      // Bold and neat spacing for print layout
      lines.push(`${formattedKey}: ${value}`);
    }
  }

  formattedExamination = lines.join('\n');
} else if (typeof record.examination === 'string') {
  formattedExamination = record.examination;
}

// Adjust these for compact layout
const compactLineHeight = 4; // smaller than default 5
const subsectionSpacing = 1;  // spacing between subsections
const sectionSpacing = 2;     // spacing after main section

// --- Prepare rightDetails ---
const rightDetails = [
  ['Complaints', record.additionalNotes || record.complaints || record.results?.complaints || '—'],
  ['Examination', record.examination || record.results?.examination || '—'],
  ['Diagnosis', record.diagnosis || record.results?.additionalNotes || '—'],
];

// --- Print rightDetails compactly ---
rightDetails.forEach(([k, v]) => {
  // Bold main header
  doc.setFont('helvetica', 'bold');
  const formattedKey = k
    .replace(/([A-Z])/g, ' $1')
    .replace(/\s+/g, ' ')
    .replace(/^./, s => s.toUpperCase());
  doc.text(`${formattedKey}:`, rightStartX, rightStartY);
  rightStartY += compactLineHeight;

  // Normal font for values
  doc.setFont('helvetica', 'normal');

  if (v && typeof v === 'object') {
    // Loop through each subsection
    for (const [section, text] of Object.entries(v)) {
      if (text && text.trim() !== '') {
        const formattedSection = section
          .replace(/([A-Z])/g, ' $1')
          .replace(/\s+/g, ' ')
          .replace(/^./, s => s.toUpperCase());

        const lines = doc.splitTextToSize(`${formattedSection}: ${text}`, lowerRightWidth - 2 * sectionPadding);
        lines.forEach(line => {
          doc.text(line, rightStartX + 3, rightStartY); // slight indent
          rightStartY += compactLineHeight;
        });
        rightStartY += subsectionSpacing; // small gap between subsections
      }
    }
  } else {
    // Single string value
    const lines = doc.splitTextToSize(String(v), lowerRightWidth - 2 * sectionPadding);
    lines.forEach(line => {
      doc.text(line, rightStartX + 3, rightStartY);
      rightStartY += compactLineHeight;
    });
  }

  rightStartY += sectionSpacing; // small gap after main section
});

// ---------------- 2️⃣ Investigations Results ----------------
if (record.results?.investigationsResults && Object.keys(record.results.investigationsResults).length > 0) {
  try {
    rightStartY += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('Laboratory Results:', rightStartX, rightStartY);
    rightStartY += lineHeight;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);

    const tableValues = [];      // ONLY for CBC / multi-parameter tests
    const radioOnlyValues = [];  // For everything else (single-value tests or radio-only)

    const resultEntries = Object.entries(record.results.investigationsResults);

    for (const [testName, vals] of resultEntries) {
      if (!Array.isArray(vals) || vals.length === 0) continue;

      const hasParameters = vals.some(v => v.parameter && v.parameter !== 'Result');
      
      // Check if this is a CBC/multi-parameter test
      const isMultiParameterTest = hasParameters && vals.length > 1;

      if (isMultiParameterTest) {
        // ---------------- Table entries (CBC or multi-parameter tests) ----------------
        const testKey = testName.replace(/\s+/g, '_').toLowerCase();
        try {
          const snapshot = await get(ref(database, `tests/${testKey}`));
          const testDef = snapshot.val();
          let paramDefs = testDef?.parameters || [];
          if (paramDefs && !Array.isArray(paramDefs)) paramDefs = Object.values(paramDefs);

          vals.forEach(v => {
            if (v.parameter && v.parameter !== 'Result') {
              const paramDef = paramDefs.find(p => p.name === v.parameter) || {};
              const valueWithUnit = `${v.parameter}: ${v.value}${paramDef.unit ? ` ${paramDef.unit}` : ''}`;
              tableValues.push(valueWithUnit);
            }
          });
        } catch {
          vals.forEach(v => {
            if (v.parameter && v.parameter !== 'Result') tableValues.push(`${v.parameter}: ${v.value}`);
          });
        }

      } else {
        // ---------------- Everything else (single-value or radio-only) ----------------
        vals.forEach(v => {
          const paramLabel = v.parameter && v.parameter !== 'Result' ? v.parameter : 'Result';
          radioOnlyValues.push(`${testName}: ${v.value}`);
        });
      }
    }

    // ---------------- Render CBC / multi-parameter Table ----------------
    if (tableValues.length > 0) {
      const cols = 4;
      const colWidth = (lowerRightWidth - 2 * sectionPadding) / cols;
      const rowHeight = 4;
      const totalRows = Math.ceil(tableValues.length / cols);

      for (let row = 0; row < totalRows; row++) {
        const y = rightStartY + row * rowHeight;
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          if (idx >= tableValues.length) break;
          const x = rightStartX + col * colWidth;

          doc.setLineWidth(0.3);
          doc.rect(x, y - rowHeight + 1, colWidth, rowHeight);

          let text = String(tableValues[idx]);
          const maxTextWidth = colWidth - 2;
          while (doc.getTextWidth(text) > maxTextWidth) {
            text = text.slice(0, -1);
          }
          const textWidth = doc.getTextWidth(text);
          const textX = x + (colWidth - textWidth) / 2;
          const textY = y;
          doc.text(text, textX, textY);
        }
      }
      rightStartY += totalRows * rowHeight + 2;
    }

   // ---------------- Render all other results ----------------
if (radioOnlyValues.length > 0) {
  rightStartY += 4;

  const boxX = rightStartX;
  const boxY = rightStartY - 4;
  const boxWidth = lowerRightWidth - 2 * sectionPadding;
  const boxPadding = 4; // more padding
  const lineHeightRadio = 4;

  const boxHeight = radioOnlyValues.length * lineHeightRadio + boxPadding * 2;
  doc.setLineWidth(0.5);
  doc.rect(boxX, boxY, boxWidth, boxHeight);

  // Heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('Other Results :', boxX + boxPadding, rightStartY);
  rightStartY += lineHeightRadio;

  // Center the text vertically inside the box
  let textStartY = rightStartY + (boxHeight - lineHeightRadio * radioOnlyValues.length - lineHeightRadio) / 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  radioOnlyValues.forEach(val => {
    doc.text(val, boxX + boxPadding, textStartY);
    textStartY += lineHeightRadio;
  });

  // Add extra spacing after the box
  rightStartY += boxHeight + 6;
}

  } catch (err) {
    console.warn("Error printing investigation results:", err);
  }

} else {
  rightStartY += 2;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.text('No investigation results recorded.', rightStartX, rightStartY);
  rightStartY += lineHeight;
}


// 3️⃣ Medications Table (Compact, 3 Columns)
if (record.results?.medication && Object.keys(record.results.medication).length > 0) {
  rightStartY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Medications:', rightStartX, rightStartY);
  rightStartY += lineHeight;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);

  const medicationNodes = record.results.medication;
  const meds = Object.keys(medicationNodes).map(key => {
    const med = medicationNodes[key];
    return {
      name: String(med.medication || 'N/A'),
      prescription: String(med.prescription || ''),
      pieces: String(med.grams != null ? med.grams : '')
    };
  });

  const cols = 3;
  const colWidths = [
    (lowerRightWidth - 2 * sectionPadding) * 0.4,
    (lowerRightWidth - 2 * sectionPadding) * 0.4,
    (lowerRightWidth - 2 * sectionPadding) * 0.2
  ];
  const rowHeight = 4;

  meds.forEach((row, index) => {
    const y = rightStartY;

    const bgColor = index % 2 === 0 ? [245, 245, 245] : [255, 255, 255];
    doc.setFillColor(...bgColor);
    doc.rect(rightStartX, y - rowHeight + 1, colWidths.reduce((a,b)=>a+b,0), rowHeight, 'F');

    const cells = [row.name, row.prescription, row.pieces];
    cells.forEach((cellText, i) => {
      const x = rightStartX + colWidths.slice(0,i).reduce((a,b)=>a+b,0);
      let text = String(cellText);
      const maxTextWidth = colWidths[i] - 2;
      while (doc.getTextWidth(text) > maxTextWidth) text = text.slice(0, -1);
      const textWidth = doc.getTextWidth(text);
      const textX = x + (colWidths[i] - textWidth) / 2;
      doc.text(text, textX, y);
    });

    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(rightStartX, y + 1, rightStartX + colWidths.reduce((a,b)=>a+b,0), y + 1);

    rightStartY += rowHeight + 1;
  });
} else {
  rightStartY += 2;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.text('No medications recorded.', rightStartX, rightStartY);
  rightStartY += lineHeight;
}


// ---------------- Procedures ----------------
if (record.proceduresTaken && record.proceduresTaken.length > 0) {
  rightStartY += 1; // smaller top spacing
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Procedures:', rightStartX, rightStartY);
  rightStartY += lineHeight - 2; // reduce spacing after heading
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  record.proceduresTaken.forEach(proc => {
    const text = `${proc.category || ''}: ${proc.name || ''}`;
    const lines = doc.splitTextToSize(text, lowerRightWidth - 2 * sectionPadding);
    lines.forEach(line => {
      doc.text(line, rightStartX, rightStartY);
      rightStartY += lineHeight - 2; // tighter line spacing
    });
  });
} else {
  rightStartY += 1;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.text('No procedures recorded.', rightStartX, rightStartY);
  rightStartY += lineHeight - 2;
}

// ---------------- Services ----------------
if (record.servicesTaken && record.servicesTaken.length > 0) {
  rightStartY += 1; // smaller top spacing
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Services:', rightStartX, rightStartY);
  rightStartY += lineHeight - 2; // reduce spacing after heading
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  record.servicesTaken.forEach(srv => {
    const text = `${srv.category || ''}: ${srv.name || ''}`;
    const lines = doc.splitTextToSize(text, lowerRightWidth - 2 * sectionPadding);
    lines.forEach(line => {
      doc.text(line, rightStartX, rightStartY);
      rightStartY += lineHeight - 2; // tighter line spacing
    });
  });
} else {
  rightStartY += 1;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.text('No services recorded.', rightStartX, rightStartY);
  rightStartY += lineHeight - 2;
}


  // ---------------- Signature ----------------
  const signatureY = boxY + boxHeight - 15;
  doc.setFont('helvetica', 'bold');
  doc.text("Doctor's Signature: ____________________", boxX + 5, signatureY);

  // ---------------- Print ----------------
  doc.autoPrint();
  doc.output('dataurlnewwindow');
}




// Generate the invoice number as the same value as the record key
function generateInvoiceNumber(recordKey) {
  return `${recordKey}`;
}


// Get the current date in a formatted string
function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return currentDate.toLocaleDateString(undefined, options);
}
const invoiceStyles = `
  .invoice {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    margin: 0 auto;
    padding: 20px;
    width: 80%;
  }

  .invoice-header {
    text-align: left;
  }

  .invoice-header h2 {
    font-size: 24px;
    margin: 0;
  }

  .invoice-header p {
    font-size: 16px;
    margin: 5px 0;
  }

  .invoice-details {
    text-align: right;
  }

  .invoice-details h1 {
    font-size: 28px;
  }

  .invoice-details p {
    font-size: 18px;
    margin: 5px 0;
  }
`;


  
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

// Add event listener to the delete button
deleteButton.addEventListener('click', () => {
  const recordKey = recordKeyElement.getAttribute('data-record-key');
  deleteRecord(recordKey);
});
recordElement.appendChild(deleteButton)
// Rest of the code...

// Function to handle opening the popup
function openPopup() {
  // Remove the existing record key input from the form
  const existingRecordKeyInput = addMedicationForm.querySelector('input[name="recordKey"]');
  if (existingRecordKeyInput) {
    existingRecordKeyInput.remove();
  }

  // Get the record key
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay3');

  const popup = document.createElement('div');
  popup.classList.add('popup3');

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('close-button');

  const heading = document.createElement('h2');
  heading.textContent = 'Add Medicine & Prescription';
  popup.appendChild(closeButton);
  popup.appendChild(heading);

  // Store the record key in a hidden input field within the form
  const recordKeyInput = document.createElement('input');
  recordKeyInput.type = 'hidden';
  recordKeyInput.name = 'recordKey';
  recordKeyInput.value = recordKey;
  addMedicationForm.appendChild(recordKeyInput);

  popup.appendChild(addMedicationForm);

  // Append the overlay and popup to the document body
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Show the overlay and popup
  overlay.style.display = 'block';
  popup.style.display = 'block';

  // Close button event listener
  closeButton.addEventListener('click', () => {
    // Clear the form fields
    const medicationContainer = document.getElementById('medicationInputsContainer');
    medicationContainer.innerHTML = '';
    document.getElementById('additionalNotes').value = '';

    // Hide the overlay and popup
    overlay.style.display = 'none';
    popup.style.display = 'none';
  });
}

// Append the medication table to the medicationTakenElement (assumed from the provided code)
//medicationTakenElement.appendChild(medicationTable);


  // Append the Finnish button to the record element
  recordElement.appendChild(finnishButton);

  // Append the delete button to the record element
  //recordElement.appendChild(deleteButton);
  recordKeyElement.setAttribute('data-record-key', recordKey);
 


// Append the upload prices button to the record element
recordElement.appendChild(uploadPricesButton);

// Create View Results button
const viewResultsButton = document.createElement('button');
viewResultsButton.textContent = 'View Results';
viewResultsButton.classList.add('view-results-button');

// Create the icon element (using Font Awesome's "fa-eye" icon)
const iconElement = document.createElement('i');
iconElement.classList.add('fas', 'fa-eye'); 
viewResultsButton.appendChild(iconElement);

// Add event listener
viewResultsButton.addEventListener('click', async () => {
  const patientName = patient.patientId;
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  // Reference the test node in Firebase
  const testRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);
console.log('Fetching results for:', patientName, recordKey);
  try {
    const snapshot = await get(testRef);
    const testData = snapshot.val();

    if (testData) {
      if (testData.resultFileURL) {
        // Open the file if it exists
        window.open(testData.resultFileURL, '_blank');
      } else if (testData.results) {
        // Show results in a popup
        openResultsPopup(testData, patientName, recordKey);
      } else {
        showMessage('No results found for this test.');
      }
    } else {
      showMessage('Test data not found.');
    }
  } catch (error) {
    console.error('Error retrieving test data:', error);
    showMessage('Error retrieving test data. Please try again.');
  }
});

// Append the button
recordElement.appendChild(viewResultsButton);
async function openResultsPopup(testData, patientName, recordKey) {
  const popup = document.getElementById('viewResultsPopup');
  const container = document.getElementById('viewResultsContainer');
  const header = document.getElementById('viewResultsHeader');

  header.textContent = `${recordKey} - Results for KMC - ${patientName}`;
  container.innerHTML = '';

  async function getTestDef(testName) {
    const testKey = testName.replace(/\s+/g, '_').toLowerCase();
    const snapshot = await get(ref(database, `tests/${testKey}`));
    return snapshot.val();
  }

  async function buildInvestigationSection(data) {
  if (!data || Object.keys(data).length === 0) return null;

  const sectionDiv = document.createElement('div');
  sectionDiv.classList.add('result-section');

  const titleEl = document.createElement('h4');
  titleEl.textContent = 'Investigations';
  titleEl.style.marginBottom = '6px';
  sectionDiv.appendChild(titleEl);

  // ---------------- Color guide ----------------
  const guideDiv = document.createElement('div');
  guideDiv.style.display = 'flex';
  guideDiv.style.gap = '10px';
  guideDiv.style.marginBottom = '8px';
  
  const colors = [
    { color: 'blue', text: 'Below Normal' },
    { color: 'green', text: 'Within Normal' },
    { color: 'red', text: 'Above Normal' }
  ];

  colors.forEach(c => {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.gap = '4px';

    const colorBox = document.createElement('div');
    colorBox.style.width = '12px';
    colorBox.style.height = '12px';
    colorBox.style.backgroundColor = c.color;
    colorBox.style.border = '1px solid #000';
    item.appendChild(colorBox);

    const label = document.createElement('span');
    label.textContent = c.text;
    label.style.fontSize = '12px';
    item.appendChild(label);

    guideDiv.appendChild(item);
  });

  sectionDiv.appendChild(guideDiv);
  // ----------------------------------------------

  for (const [testName, results] of Object.entries(data)) {
    const testDiv = document.createElement('div');
    testDiv.classList.add('test-result-block');
    testDiv.style.marginBottom = '10px';

    const nameEl = document.createElement('h5');
    nameEl.textContent = isNaN(testName) ? testName : `Test ${parseInt(testName) + 1}`;
    nameEl.style.marginBottom = '4px';
    testDiv.appendChild(nameEl);

    const testDef = await getTestDef(testName);
    let paramDefs = testDef?.parameters || [];
    if (paramDefs && !Array.isArray(paramDefs)) paramDefs = Object.values(paramDefs);

    const table = document.createElement('table');
    table.classList.add('results-table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Parameter', 'Value', 'Normal Range', 'Unit'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    const addRow = (parameter, value, normal, unit) => {
      const tr = document.createElement('tr');
      [parameter, value, normal, unit].forEach((val, idx) => {
        const td = document.createElement('td');
        td.textContent = val;

        // Color the value cell (index 1) based on normal range
        if (idx === 1 && normal) {
          const numericVal = parseFloat(value);
          const rangeMatch = normal.match(/([\d.]+)\s*-\s*([\d.]+)/);
          if (rangeMatch) {
            const min = parseFloat(rangeMatch[1]);
            const max = parseFloat(rangeMatch[2]);
            if (!isNaN(numericVal)) {
              if (numericVal < min) td.style.color = 'blue';
              else if (numericVal > max) td.style.color = 'red';
              else td.style.color = 'green';
            }
          } else {
            const singleVal = parseFloat(normal);
            if (!isNaN(numericVal) && !isNaN(singleVal)) {
              td.style.color = numericVal === singleVal ? 'green' : 'red';
            }
          }
        }

        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    };

    if (Array.isArray(results)) {
      results.forEach(r => {
        const paramDef = paramDefs.find(p => p.name === r.parameter) || {};
        addRow(
          r.parameter || '-',
          r.value || '-',
          paramDef.normal || '-',
          paramDef.unit || '-'
        );
      });
    } else if (typeof results === 'object') {
      Object.entries(results).forEach(([paramKey, paramVal]) => {
        let parameter = paramKey;
        let value = '';
        let normal = '';
        let unit = '';

        if (typeof paramVal === 'object') {
          parameter = paramVal.parameter || paramKey;
          value = paramVal.value || '';
          const paramDef = paramDefs.find(p => p.name === parameter) || {};
          normal = paramDef.normal || '';
          unit = paramDef.unit || '';
        } else {
          value = paramVal;
        }

        addRow(parameter, value, normal, unit);
      });
    }

    table.appendChild(tbody);
    testDiv.appendChild(table);
    sectionDiv.appendChild(testDiv);
  }

  return sectionDiv;
}
function buildSimpleSection(title, data) {
  if (!data || Object.keys(data).length === 0) return null;

  const sectionDiv = document.createElement('div');
  sectionDiv.classList.add('result-section');

  const titleEl = document.createElement('h4');
  titleEl.textContent = title;
  titleEl.style.marginBottom = '6px';
  sectionDiv.appendChild(titleEl);

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '8px'; // spacing between blocks
  sectionDiv.appendChild(container);

  Object.entries(data).forEach(([key, val]) => {
    const block = document.createElement('div');
    block.style.background = '#f9f9f9';
    block.style.padding = '6px 10px';
    block.style.borderRadius = '5px';
    block.style.flex = '1 1 calc(33% - 8px)'; // 3 per row, adjust if needed
    block.style.minWidth = '120px'; // ensures small blocks don't shrink too much
    block.style.boxSizing = 'border-box';
    block.style.display = 'flex';
    block.style.flexDirection = 'column';

    const nameEl = document.createElement('strong');
    nameEl.textContent = isNaN(key) ? key : `Item ${parseInt(key) + 1}`;
    nameEl.style.marginBottom = '2px';
    block.appendChild(nameEl);

    const valueEl = document.createElement('span');
    valueEl.textContent = typeof val === 'object' ? (val.value || '-') : val;
    valueEl.style.fontSize = '13px';
    block.appendChild(valueEl);

    container.appendChild(block);
  });

  return sectionDiv;
}


  const investigationsSection = await buildInvestigationSection(testData.results?.investigationsResults);
  const proceduresSection = buildSimpleSection('Procedures', testData.results?.proceduresResults);
  const servicesSection = buildSimpleSection('Services', testData.results?.servicesResults);

  [investigationsSection, proceduresSection, servicesSection].forEach(sec => {
    if (sec) container.appendChild(sec);
  });

  if (!investigationsSection && !proceduresSection && !servicesSection) {
    const p = document.createElement('p');
    p.textContent = 'No results available for this record.';
    container.appendChild(p);
  }

  popup.style.display = 'flex';
  const closeBtn = popup.querySelector('.close-popup-button');
  closeBtn.onclick = () => { popup.style.display = 'none'; };
}

  
  return recordElement;
}

// Function to delete a record from the database
function deleteRecord(recordKey) {
  const patientName = patient.patientId; // Replace this with the patient's name

  // Prompt the user for confirmation
  const confirmation = confirm('Are you sure you want to delete this record?');

  if (confirmation) {
    // Prompt the user for password
    const password = prompt('Please enter your password to confirm the deletion:');
    
    // Check if the password is correct
    if (password === 'sanyu44') { // Replace 'your_password' with the actual password
      // Create a reference to the specific record in the patient's history
      const recordRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);

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

}



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
//const patientsRef = ref(database, 'patients');

// Show the loader
loaderElement.classList.remove('hidden');

// Fetch patient data from Firebase
onValue(patientsRef, (snapshot) => {
  patientsData = snapshot.val() ? Object.values(snapshot.val()).reverse() : [];
  // Update the pagination and render the patients
  renderPatients();
  loaderElement.classList.add('hidden');

});

// Function to calculate the total based on inputs
const calculateTotal = () => {
  const medicationCost = parseFloat(
    medicationInput.selectedOptions[0].dataset.costPerGram
  );
  const gramsValue = parseFloat(gramsInput.value);
  const total = medicationCost * gramsValue;

  // Update the total element with the calculated value
  totalElement.textContent = 'Total: $' + total.toFixed(2);
};
// Function to create a new medication input with delete button
const createMedicationInput = () => {
  const medicationInputContainer = document.createElement('div');
  medicationInputContainer.classList.add('medication-input-container');

  // Medication label
  const medicationLabel = document.createElement('label');
  medicationLabel.textContent = 'Medicine:';
  medicationLabel.setAttribute('for', 'medicationInput');

  const medicationInput = document.createElement('select');
  medicationInput.required = true;
  medicationInput.classList.add('select2');
const medicineRef = ref(database, 'medicine');
onValue(medicineRef, (snapshot) => {
  const medicineData = snapshot.val();
  if (medicineData) {
    Object.values(medicineData).forEach((medicine) => {
      const option = document.createElement('option');
      option.value = medicine.name;
      option.text = medicine.name;

      // Set Keah price from insurancePrices
      option.dataset.keahPrice = medicine.insurancePrices?.keah || 0;

      medicationInput.appendChild(option);
    });

    // Initialize Select2 for the medicationInput
    $(medicationInput).select2({
      dropdownParent: medicationInputContainer
    });
  }
});

// Prescription label
const prescriptionLabel = document.createElement('label');
prescriptionLabel.textContent = 'Prescription:';
prescriptionLabel.setAttribute('for', 'prescriptionInput');

// Create an input element for manual input
const prescriptionInput = document.createElement('input');
prescriptionInput.type = 'text';
prescriptionInput.required = true;
prescriptionInput.id = 'prescriptionInput';


  // Grams label
  const gramsLabel = document.createElement('label');
  gramsLabel.textContent = 'Pieces:';
  gramsLabel.setAttribute('for', 'gramsInput');

  const gramsInput = document.createElement('input');
  gramsInput.type = 'number';
  gramsInput.step = 'any'; // Allow decimal values for grams
  gramsInput.placeholder = 'Pieces';

  // Cost per gram output label
  const costPerGramLabel = document.createElement('label');
  costPerGramLabel.textContent = 'Cost of Pieces:';
  costPerGramLabel.setAttribute('for', 'costPerGramOutput');

  const costPerGramOutput = document.createElement('output');
  costPerGramOutput.classList.add('cost-per-gram-output');
  costPerGramOutput.value = '';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-medication-button');
  deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
  deleteButton.addEventListener('click', () => {
    medicationInputContainer.remove();
  });

gramsInput.addEventListener('input', () => {
  const gramsValue = parseFloat(gramsInput.value) || 0;
  const selectedOption = medicationInput.options[medicationInput.selectedIndex];
  const keahPrice = parseFloat(selectedOption.dataset.keahPrice) || 0;
  const totalCost = gramsValue * keahPrice;

  costPerGramOutput.value = totalCost.toLocaleString();
});


  medicationInputContainer.appendChild(medicationLabel);
  medicationInputContainer.appendChild(medicationInput);
  medicationInputContainer.appendChild(prescriptionLabel);
  medicationInputContainer.appendChild(prescriptionInput);
  medicationInputContainer.appendChild(gramsLabel);
  medicationInputContainer.appendChild(gramsInput);
  medicationInputContainer.appendChild(costPerGramLabel);
  medicationInputContainer.appendChild(costPerGramOutput);
  medicationInputContainer.appendChild(deleteButton);

  const submitMedicationButton = document.createElement('button');
  submitMedicationButton.type = 'button';
  submitMedicationButton.textContent = 'Submit Medication';
  submitMedicationButton.classList.add('submit-medication-button');
  submitMedicationButton.addEventListener('click', () => {
    const medicationRecord = {
      medication: medicationInput.value,
      prescription: prescriptionInput.value,
      grams: parseFloat(gramsInput.value),
      totalCost: parseFloat(costPerGramOutput.value.replace(/,/g, ''))
    };

    // Get the record key from the hidden input field
    const recordKeyInput = document.querySelector('input[name="recordKey"]');
    const recordKey = recordKeyInput.value;

    // Write medication record to Firebase under the record key
    const patientRef = ref(database, `patients/${currentPatientName}/testsTaken/${recordKey}/results/medication`);
    const newRecordRef = push(patientRef);

    set(newRecordRef, medicationRecord)
      .then(() => {
        showMessage('Medication submitted successfully!');
      })
      .catch((error) => {
        console.error('Error submitting medication:', error);
        showMessage('Error submitting medication. Please try again.');
      });
  });

  medicationInputContainer.appendChild(submitMedicationButton);

  return medicationInputContainer;
};

const addMedicationButton = document.getElementById('addMedicationButton');
const medicationContainer = document.getElementById('medicationInputsContainer');
addMedicationButton.addEventListener('click', () => {
  const medicationInput = createMedicationInput();
  medicationContainer.appendChild(medicationInput);

  // Initialize Select2 for the new medication input
  $(medicationInput).find('select.select2').select2();
});


// Update the total cost when grams input changes
const medicationInputs = document.querySelectorAll('.medication-input-container');
medicationInputs.forEach((medicationInput) => {
  const gramsInput = medicationInput.querySelector('input[type="number"]');

});

// Update the total cost when the selected test changes
////const testsTakenSelect = document.getElementById('testsTaken');
//testsTakenSelect.addEventListener('change', () => {

//});

// Retrieve tests from Firebase and populate the select options
const testsRef = ref(database, 'tests');
onValue(testsRef, (snapshot) => {
  const testsData = snapshot.val();

  // Clear existing options
  //testsTakenSelect.innerHTML = '';
  //testsTakenSelect.innerHTML = '<option value="" disabled selected>Click to select test to be done.</option>';

  // Add options for each test
  if (testsData) {
    const tests = Object.values(testsData);
    tests.forEach((test) => {
      const option = document.createElement('option');
      option.value = test.name + '      '+ '   Price: UGX ' + test.dob + '.00';
      option.textContent = test.name + '      '+ '   Price: UGX ' + test.dob + '.00';
      option.dataset.dob = test.dob;
     // testsTakenSelect.appendChild(option);
    });
  }


});






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
// --- DOM references ---
const servicesSelect = document.getElementById('services');           // main services category
const serviceDetails = document.getElementById('serviceDetails');     // sub-dropdown
addRecordForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const patientName = currentPatientName;
  const medicationInputs = document.querySelectorAll('.medication-input-container');

  // --- Extract selected items ---
  const investigationsTaken = selectedInvestigations.map(item => ({
    name: item.name,
    amount: Number(item.price) || 0,
    category: item.category || 'Uncategorized'
  }));

  const proceduresTaken = selectedProcedures.map(item => ({
    name: item.name,
    amount: Number(item.price) || 0,
    category: item.category || 'Uncategorized'
  }));

  const servicesTaken = selectedServices.map(item => ({
    name: item.name,
    amount: Number(item.price) || 0,
    category: item.category || 'Uncategorized'
  }));

  // --- Calculate total amount ---
  const totalAmount = [
    ...investigationsTaken,
    ...proceduresTaken,
    ...servicesTaken
  ].reduce((sum, item) => sum + item.amount, 0);

  // --- Prepare selectedItems array ---
  const selectedItems = [
    ...investigationsTaken.map(i => i.name),
    ...proceduresTaken.map(p => p.name),
    ...servicesTaken.map(s => s.name)
  ];

  const additionalNotes = document.getElementById('Concerns')?.value || '';

  // --- Get Examination Data (General + Dynamic + Impression) ---
  const generalExamination = document.getElementById('examination')?.value || '';
  const impression = document.getElementById('impression')?.value || '';

  // Collect all dynamically added textareas
  const dynamicSections = {};
  document.querySelectorAll('#extraExaminations textarea').forEach(textarea => {
    const id = textarea.parentElement.id; // from the label key
    const label = textarea.previousElementSibling.textContent.replace(':', '');
    dynamicSections[label] = textarea.value;
  });

  // Combine everything into one examination object
  const examinationData = {
    generalExamination,
    ...dynamicSections,
    impression
  };

  const dateTaken = Date.now();

  // --- Create full record object ---
  const recordData = {
    investigationsTaken,
    proceduresTaken,
    servicesTaken,
    selectedItems,
    totalAmount,
    additionalNotes,
    examination: examinationData,  // ✅ full structured exam data
    dateTaken
  };

  console.log('Record Data:', recordData);

  // --- Save to Firebase ---
  const patientRef = ref(database, `patients/${patientName}`);
  const testsTakenRef = child(patientRef, 'testsTaken');

  get(testsTakenRef)
    .then(snapshot => {
      const testsData = snapshot.val();
      const testCount = testsData ? Object.keys(testsData).length : 0;
      const newTestNumber = testCount + 1;
      const newRecordRef = child(testsTakenRef, 'test' + newTestNumber);

      set(newRecordRef, recordData)
        .then(() => {
          // --- Save medication data ---
          medicationInputs.forEach(input => {
            const medSelect = input.querySelector('select[name="medication"]');
            const prescriptionSelect = input.querySelector('select[name="prescription"]');
            const gramsInput = input.querySelector('input[name="grams"]');
            const costOutput = input.querySelector('.cost-per-gram-output');

            if (medSelect && prescriptionSelect && gramsInput && costOutput) {
              const medRecord = {
                medication: medSelect.value,
                prescription: prescriptionSelect.value,
                grams: parseFloat(gramsInput.value),
                totalCost: parseFloat(costOutput.value.replace(/,/g, ''))
              };
              push(child(newRecordRef, 'medication'), medRecord);
            }
          });

          // ✅ Reset the form and UI
          addRecordForm.reset();
          selectedInvestigations = [];
          selectedProcedures = [];
          selectedServices = [];
          renderSelectedList('investigationList', selectedInvestigations);
          renderSelectedList('procedureList', selectedProcedures);
          renderSelectedList('serviceList', selectedServices);

          // Remove dynamically added fields
          document.getElementById('extraExaminations').innerHTML = '';
          document.querySelectorAll('.exam-btn').forEach(btn => {
            btn.textContent = '➕ ' + btn.textContent.replace(/^[➕✖]\s*/, '');
            btn.classList.remove('red');
          });

          showMessage('Record added successfully!');
          addRecordPopupOverlay.style.visibility = 'hidden';
          addRecordPopupOverlay.style.opacity = '0';
        })
        .catch(error => {
          console.error('Error saving new record:', error);
          showMessage('Error adding record. Please try again.');
        });
    })
    .catch(error => {
      console.error('Error retrieving existing records:', error);
      showMessage('Error retrieving existing records. Please try again.');
    });
});

// Function to save all fields
function saveAllData() {
  const additionalNotes = document.getElementById('additionalNotes').value;
  const finalStatus = document.querySelector('input[name="finalStatus"]:checked');
  const followUpDateTime = document.getElementById('followUpDateTime').value;

  // Create an object to hold the data to be saved
  const dataToSave = {};
  
  // Only add fields that have values
  if (additionalNotes) {
      dataToSave.additionalNotes = additionalNotes;
  }
  
  if (finalStatus) {
      dataToSave.finalStatus = finalStatus.value;
  }
  
  if (followUpDateTime) {
      dataToSave.followUpDateTime = followUpDateTime;
  } 
  
  // Get the record key from the hidden input field
  const recordKeyInput = document.querySelector('input[name="recordKey"]');
  const recordKey = recordKeyInput.value;
  
  // Reference to the specific patient, test, and results in Firebase
  const patientRef = ref(database, `patients/${currentPatientName}/testsTaken/${recordKey}/results`);
 
  // Update the data in Firebase
  if (Object.keys(dataToSave).length > 0) {
      update(patientRef, dataToSave)
          .then(() => {
              //showMessage('All data saved successfully!');
              //console.log(dataToSave)
          })
          .catch((error) => {
              console.error('Error saving data:', error);
              showMessage('Error saving data. Please try again.');
          });
  } else {
      showMessage('No data to save. Please fill in at least one field.');
  }
}


const submitMedicationBtn = document.getElementById('submitMedicationButton');
 
submitMedicationBtn.addEventListener('click', (event) => {
  event.preventDefault();
  saveAllData();

  const medicationRecord = {
    medication: document.getElementById('medication').value,
    additionalNotes: document.getElementById('additionalNotes').value,
    finalStatus: getFinalStatus(),
    followUpDateTime: document.getElementById('followUpDateTime').value
  };

  const recordKeyInput = document.querySelector('input[name="recordKey"]');
  const recordKey = recordKeyInput.value;

  const patientRef = ref(database, `patients/${currentPatientName}/testsTaken/${recordKey}/results`);

  get(patientRef)
    .then((snapshot) => {
      const existingData = snapshot.val() || {};
      if (!existingData.medication) existingData.medication = [];
      existingData.medication.push({ medication: medicationRecord.medication });

      if (medicationRecord.additionalNotes) existingData.additionalNotes = medicationRecord.additionalNotes;
      if (medicationRecord.finalStatus) existingData.finalStatus = medicationRecord.finalStatus;
      if (medicationRecord.followUpDateTime) existingData.followUpDateTime = medicationRecord.followUpDateTime;

      return update(patientRef, existingData);
    })
    .then(() => {
      showMessage('Medication submitted successfully!');

      // --- CLOSE THE POPUP ---
      const popup = document.querySelector('.popup3');
      const overlay = document.querySelector('.overlay3');

      if (popup && overlay) {
        popup.remove();
        overlay.remove();
      }

      // Clear the form fields
      const medicationContainer = document.getElementById('medicationInputsContainer');
      medicationContainer.innerHTML = '';
      document.getElementById('additionalNotes').value = '';
      document.getElementById('followUpDateTime').value = '';
    })
    .catch((error) => {
      console.error('Error updating medication:', error);
      showMessage('Error submitting medication. Please try again.');
    });



// Event listener for the "Save All" button
document.getElementById('saveAllButton').addEventListener('click', (event) => {
  event.preventDefault(); // Prevent default button behavior
  saveAllData(); // Call the function to save all data
});



  // Trigger the click event for all submitMedicationButton elements
  const submitMedicationButtons = document.querySelectorAll('.submit-medication-button');
  submitMedicationButtons.forEach((button) => {
    button.click();
  });

  // Clear medication inputs
  const medicationContainer = document.getElementById('medicationInputsContainer');
  medicationContainer.innerHTML = '';
  document.getElementById('additionalNotes').value = '';
  document.getElementById('followUpDateTime').value = '';
});






function getFinalStatus() {
  const finalStatusRadios = document.getElementsByName('finalStatus');
  for (const radio of finalStatusRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return ''; // Return an empty string if no radio button is checked
}




// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}



// Get the lab requests popup elements
const listPopupOverlay = document.getElementById('listPopupOverlay');
// Variable to store the latest lab request message
let listMessage = null;
const shownMessages = new Set(); // Set to keep track of shown messages

// Function to display a custom notification message and play a sound
function showRequestMessage(message) {
  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'request-notification'; // Add a class for styling
  notificationContainer.textContent = message;

  // Append the notification to the body
  document.body.appendChild(notificationContainer);

  // Remove the notification after a few seconds
  setTimeout(() => {
    notificationContainer.remove();
  }, 9000); // Adjust the duration as needed
}

// Function to play a sound without displaying a message
function playNotificationSound() {
  // Play a sound (you can replace 'notification.mp3' with your desired sound file)
  const audio = new Audio('new-notification-on-your-device-138695.mp3');
  audio.play();
}

// Function to display a browser notification and play a sound
function showNotification(message, timestamp) {
  if (!shownMessages.has(timestamp)) {
    // Play the notification sound
    playNotificationSound();

    // Add the timestamp to the set of shown messages
    shownMessages.add(timestamp);
  }
}



// Array to cache patient messages
const patientMessagesCache = [];

// Function to retrieve and display lab requests from Firebase
function retrieveAndDisplaylist() {
  const waitinglist = document.getElementById('waitinglist');
  waitinglist.innerHTML = ''; // Clear previous lab requests

  const chatRef = ref(database, 'waiting-list');
  onValue(chatRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        let listCount = 0;

        // Add event listeners to the filter buttons
        const notseen = document.getElementById('notseen');
        const seen = document.getElementById('seen');

        notseen.addEventListener('click', () => {
          applyFilter('Not Yet Done');
        });

        seen.addEventListener('click', () => {
          applyFilter('Completed');
        });

        // Function to apply the filter
        function applyFilter(filter) {
          const waitinglist = document.getElementById('waitinglist');
          const waitinglistItems = waitinglist.querySelectorAll('li');

          waitinglistItems.forEach((item) => {
            const status = item.getAttribute('data-status');
            if (status === filter || filter === 'All') {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });

          // Update the active filter button
          const filterButtons = document.querySelectorAll('.filter-button');
          filterButtons.forEach((button) => {
            if (button.textContent === filter) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          });
        }

        const messages = [];
        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;

          // Check if the patient message is already in the cache
          if (!patientMessagesCache.includes(messageId)) {
            patientMessagesCache.push(messageId); // Add the patient message key to the cache

            // Show a notification for the latest patient message
            showNotification(childSnapshot.val().name, messageId);
          }

          const patient = childSnapshot.val().name;
          const status = childSnapshot.val().status || 'Not Yet Done';
          const timestamp = childSnapshot.val().date || '';
          const listItem = document.createElement('li');
          listItem.id = messageId; // Set the ID to the message ID
          listItem.setAttribute('data-status', status); // Set the "data-status" attribute

          // Create the message content with "Mark as Done" button
          const messageContent = document.createElement('span');
          messageContent.textContent = patient;
          listItem.appendChild(messageContent);

          // Create the "Mark as Done" button
          const messageStatus = document.createElement('span');
          messageStatus.textContent = status + (timestamp ? ' - ' + formatDate(timestamp) : '');
          messageStatus.classList.add('time-status'); // Add the CSS class to the span element
          listItem.appendChild(messageStatus);

          // Create the "Done" button
          const markAsDoneBtn2 = document.createElement('button');
          markAsDoneBtn2.textContent = 'Seen';
          markAsDoneBtn2.classList.add('button-done'); // Add the CSS class to the button
          markAsDoneBtn2.addEventListener('click', () => {
            markpatientAsDone(messageId);
          });
          listItem.appendChild(markAsDoneBtn2);

          // Add each message to the beginning of the array
          messages.unshift(listItem);

          if (status === 'Not Yet Done') {
            listCount++;
            messageStatus.style.color = 'red';
          } else if (status === 'Completed') {
            markAsDoneBtn2.style.display = 'none';
          }
        });

        // Append the reversed array of messages to the waiting list
        messages.forEach((message) => {
          waitinglist.appendChild(message);
        });

        // Display the count of not yet done messages
        const listCountSpan = document.getElementById('listCount');
        listCountSpan.textContent = listCount;
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'No one is waiting.';
        waitinglist.appendChild(listItem);
      }
    } catch (error) {
      console.error('Error retrieving waiting list:', error);
      showMessage('Error retrieving waiting list:', error);
    }
  });
}



// Attach click event to the envelope icon to open the lab requests popup
const list = document.getElementById('list');
let listListener; // Variable to store the event listener

list.addEventListener('click', () => {
  // Retrieve and display lab requests from Firebase
  retrieveAndDisplaylist();

  openlistPopup();
});

// Call the retrieveAndDisplayLabRequests function on page load
document.addEventListener('DOMContentLoaded', () => {
  retrieveAndDisplaylist();
});

function markpatientAsDone(messageId) {
  // Update the message status in Firebase
  const listRef = ref(database, `waiting-list/${messageId}`);
  update(listRef, { status: 'Completed', timestamp: Date.now() })
    .then(() => {
      console.log('Message marked as done successfully!');
      // Clear the whole list and reload new messages
      retrieveAndDisplaylist();
    })
    .catch((error) => {
      console.error('Error marking message as done:', error);
      showMessage('Error marking message as done:', error);
    });
}

// Function to format a timestamp in a human-readable format
//function formatDate(timestamp) {
 // const date = new Date(timestamp);
 // const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  //return date.toLocaleString(undefined, options);
//}

// Function to open the lab requests popup
function openlistPopup() {
  const listPopupOverlay = document.getElementById('listPopupOverlay');
  listPopupOverlay.style.display = 'block';
}

// Function to close the lab requests popup
function closelistPopup() {
  const listPopupOverlay = document.getElementById('listPopupOverlay');
  listPopupOverlay.style.display = 'none';
}

// Attach click event to the close button to close the lab requests popup
const listPopupClose = document.getElementById('listPopupClose');
listPopupClose.addEventListener('click', closelistPopup);

// Close the lab requests popup when clicking outside the popup content
window.addEventListener('click', (event) => {
  const listPopupOverlay = document.getElementById('listPopupOverlay');
  if (event.target === listPopupOverlay) {
    closelistPopup();
  }
});
/*
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
*/




//end of waiting list 





// Get the lab requests popup elements
const labRequestsPopupOverlay = document.getElementById('listPopupOverlay');
// Variable to store the latest lab request message
let latestLabRequestMessage = null;
const labResultShownMessages = new Set(); // Set to keep track of shown lab result messages

// Function to play a lab result notification sound without displaying a message
function playLabResultNotificationSound() {
  // Play a sound (replace 'lab-notification.mp3' with your desired sound file)
  const audio = new Audio('simple-notification-152054.mp3');
  audio.play();
}

// Function to display a lab result browser notification and play a sound
function showLabResultNotification(message, messageId) {
  if (!labResultShownMessages.has(messageId)) {
    // Play the lab result notification sound
    playLabResultNotificationSound();

    // Add the message ID to the set of shown lab result messages
    labResultShownMessages.add(messageId);
  }
}

// Array to cache lab result messages
const labResultMessagesCache = [];

// Function to retrieve and display lab requests from Firebase
function retrieveAndDisplayLabRequests() {
  const labRequestsList = document.getElementById('labRequestsList');
  labRequestsList.innerHTML = ''; // Clear previous lab requests

  const chatRef = ref(database, 'lab-results');
  onValue(chatRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        let notDoneCount = 0;
        const messages = [];

        // Initialize variables to track latest message
        let latestLabRequestMessage = null;
        let latestLabRequestTimestamp = null;

        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          const labRequest = childSnapshot.val().message;
          const status = childSnapshot.val().status || 'Not Yet Done';
          const timestamp = childSnapshot.val().timestamp || '';

          // Check if the timestamp matches the current time
          const currentTime = new Date();
          const messageTime = new Date(timestamp);

          if (messageTime.getTime() === currentTime.getTime()) {
            // Show a notification for the current time lab request message
            showLabResultNotification(labRequest, messageId);
          }

          const listItem = document.createElement('li');
          listItem.id = messageId; // Set the ID to the message ID
          listItem.setAttribute('data-status', status); // Set the "data-status" attribute

          // Create the message content with "Mark as Done" button
          const messageContent = document.createElement('span');
          messageContent.textContent = labRequest;
          listItem.appendChild(messageContent);

          // Create the "Done" button
          const messageStatus = document.createElement('span');
          messageStatus.textContent = status + (timestamp ? ' - ' + formatDate(timestamp) : '');
          messageStatus.classList.add('time-status'); // Add the CSS class to the span element
          listItem.appendChild(messageStatus);

          // Create the "Mark as Done" button
          const markAsDoneBtn = document.createElement('button');
          markAsDoneBtn.textContent = 'Clear';
          markAsDoneBtn.classList.add('button-done'); // Add the CSS class to the button
          markAsDoneBtn.addEventListener('click', () => {
            markMessageAsDone(messageId);
          });
          listItem.appendChild(markAsDoneBtn);

          // Add each message to the beginning of the array
          messages.unshift(listItem);

          if (status === 'Not Yet Done') {
            notDoneCount++;
            messageStatus.style.color = 'red';
            // Update the latest lab request message and timestamp
            if (!latestLabRequestTimestamp || messageTime > latestLabRequestTimestamp) {
              latestLabRequestMessage = labRequest;
              latestLabRequestTimestamp = messageTime;
            }
          } else if (status === 'Completed') {
            markAsDoneBtn.style.display = 'none';
          }
        });

        // Append the reversed array of messages to the lab requests list
        messages.forEach((message) => {
          labRequestsList.appendChild(message);
        });

        // Show a notification for the latest message (if there is any latest message)
        if (latestLabRequestMessage) {
          showLabResultNotification(latestLabRequestMessage);
        }

        // Display the count of not yet done messages
        const notDoneCountSpan = document.getElementById('notDoneCount');
        notDoneCountSpan.textContent = notDoneCount;
      } else {
        const noLabRequestsItem = document.createElement('li');
        noLabRequestsItem.textContent = 'No lab results found.';
        labRequestsList.appendChild(noLabRequestsItem);
      }
    } catch (error) {
      console.error('Error retrieving lab results:', error);
      showMessage('Error retrieving lab results:', error);
    }
  });
}


// Attach click event to the envelope icon to open the lab requests popup
const envelopeIcon = document.getElementById('envelope-icon');
let labRequestsListener; // Variable to store the event listener

envelopeIcon.addEventListener('click', () => {
  // Retrieve and display lab requests from Firebase
  retrieveAndDisplayLabRequests();

  openLabRequestsPopup();
});

// Call the retrieveAndDisplayLabRequests function on page load
document.addEventListener('DOMContentLoaded', () => {
  retrieveAndDisplayLabRequests();
});

function markMessageAsDone(messageId) {
  // Update the message status in Firebase
  const messageRef = ref(database, `lab-results/${messageId}`);
  update(messageRef, { status: 'Completed', timestamp: Date.now() })
    .then(() => {
      console.log('Message marked as done successfully!');
      // Clear the whole list and reload new messages
      retrieveAndDisplayLabRequests();
    })
    .catch((error) => {
      console.error('Error marking message as done:', error);
      showMessage('Error marking message as done:', error);
    });
}

// Function to format a timestamp in a human-readable format
//function formatDate(timestamp) {
 // const date = new Date(timestamp);
 // const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  //return date.toLocaleString(undefined, options);
//}

// Function to open the lab requests popup
function openLabRequestsPopup() {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  labRequestsPopupOverlay.style.display = 'block';
}

// Function to close the lab requests popup
function closeLabRequestsPopup() {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  labRequestsPopupOverlay.style.display = 'none';
}

// Attach click event to the close button to close the lab requests popup
const labRequestsPopupClose = document.getElementById('labRequestsPopupClose');
labRequestsPopupClose.addEventListener('click', closeLabRequestsPopup);

// Close the lab requests popup when clicking outside the popup content
window.addEventListener('click', (event) => {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  if (event.target === labRequestsPopupOverlay) {
    closeLabRequestsPopup();
  }
});



/*


const uploadForm = document.getElementById('addPatientForm');




uploadForm.addEventListener('DOMContentLoaded', () => {
  populateNextPatientId();
});

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('name');
  const dobInput = document.getElementById('dob');
  const parentsInput = document.getElementById('parents');
  const residenceInput = document.getElementById('residence');
  const paymentInput = document.getElementById('payment');
  const sexInput = document.getElementById('sex');
  const patientIdInput = document.getElementById('patientId');

  // Save patient data to Firebase
  const savePatientData = () => {
    const name = nameInput.value;
    const dob = dobInput.value;
    const parents = parentsInput.value;
    const residence = residenceInput.value;
    const payment = paymentInput.value;
    const sex = sexInput.value;
    const patientId = patientIdInput.value;

    const patientsRef = ref(database, 'patients');
    const newPatientRef = child(patientsRef, patientId); // Use patient ID as the key

    set(newPatientRef, {
      name: name,
      dob: dob,
      parents: parents,
      residence: residence,
      payment: payment,
      sex: sex,
      patientId: patientId
    })
      .then(() => {
        nameInput.value = '';
        dobInput.value = '';
        parentsInput.value = '';
        residenceInput.value = '';
        paymentInput.value = '';
        sexInput.value = '';
        patientIdInput.value = '';

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

// Attach the savePatientData function to the form submit event
const addPatientForm = document.getElementById('addPatientForm');
addPatientForm.addEventListener('submit', (e) => {
  e.preventDefault();
  savePatientData();
});

});

*/


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
 // Hide the splash screen after the website content is loaded
 window.addEventListener('load', function () {
      const splashScreen = document.getElementById('splashScreen');
      splashScreen.style.opacity = '0';
      setTimeout(function () {
        splashScreen.style.display = 'none';
      }, 500); // Change this duration to control how long the splash screen is shown (in milliseconds)
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
    
    // Array to store timestamps of all messages retrieved
    let messageTimestamps = [];
    
    // Get the last opened timestamp from local storage
    const lastOpenedTimestamp = localStorage.getItem('lastOpenedTimestamp');
    
    // Compare the last opened timestamp with message timestamps
    const updateUnreadMessageCount = () => {
      const unreadMessageCount = messageTimestamps.filter(timestamp => new Date(timestamp) > new Date(lastOpenedTimestamp)).length;
      const spanCount = document.getElementById('unreadMessageCount');
      spanCount.textContent = unreadMessageCount.toString();
    };
    
    // Listen for new messages
    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          const message = childSnapshot.val();
    
          // Store the timestamp of the message
          messageTimestamps.push(message.timestamp);
    
          // Display the message only if it's not already displayed
          if (!displayedMessageIds.includes(messageId)) {
            displayChatMessage(message);
            playMessageSound(message.sender);
            displayedMessageIds.push(messageId);
          }
        });
    
        // Update unread message count after processing all new messages
        updateUnreadMessageCount();
      }
    });
    
    const openChatBtn = document.getElementById('openChatBtn');
    
    // Event listener for opening the chat room button
    openChatBtn.addEventListener('click', () => {
      // Reset span count to 0
      const spanCount = document.getElementById('unreadMessageCount');
      spanCount.textContent = '0';
    
      // Register the time and date when the chat room is opened
      const lastOpenedTimestamp = new Date().toISOString();
      localStorage.setItem('lastOpenedTimestamp', lastOpenedTimestamp);
    
      // Display chat room
      chatOverlay.style.display = 'block';
      chatContainer.style.display = 'block';
    });
    
    
    // Rest of your code...
    
    
    
    
    
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
 // Request permission for notifications when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

// Assuming currentPageSender is defined elsewhere in your code
 const currentPageSender = 'Doctors Room'; // Example

// Function to parse timestamp in the format "6/13/2024 6:53 PM"
function parseTimestamp(timestampStr) {
  return new Date(Date.parse(timestampStr));
}

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

    // Append tick icon for read status
    const tickIcon = document.createElement('i');
    tickIcon.classList.add('tick-icon', 'fas', 'fa-check'); // Assuming you're using Font Awesome for the tick icon
    if (message.read) {
      tickIcon.classList.add('read'); // Add 'read' class if message is read
    }
    //headerDiv.appendChild(tickIcon);

    messageDiv.appendChild(headerDiv);

    // Display message text
    const messageTextSpan = document.createElement('span');
    messageTextSpan.textContent = message.text;
    messageDiv.appendChild(messageTextSpan);

    // Display timestamp in 6:00 pm format
    const timestampSpan = document.createElement('span');
    const timestamp = parseTimestamp(message.timestamp);
    const formattedDate = `${timestamp.toLocaleDateString()} `;
    const formattedTime = `${timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    timestampSpan.textContent = `${formattedDate}${formattedTime}`;
    timestampSpan.style.fontSize = '9px'; // Set font size for the timestamp
    timestampSpan.style.color = '#888'; // Set color for the timestamp
    messageDiv.appendChild(timestampSpan);

    // Add different classes based on the sender
    if (message.sender === 'Doctors Room') {
      messageDiv.classList.add('patients-reception');
    } else {
      messageDiv.classList.add('other-sender');
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message

    // Display browser notification for new message if sent now and sender is different from the current page
    const currentTime = new Date();
    const timeDifference = currentTime - timestamp;
    const timeThreshold = 5000; // 5 seconds

    if (Notification.permission === 'granted' && timeDifference <= timeThreshold && message.sender !== currentPageSender) {
      new Notification('New message from ' + message.sender, {
        body: message.text,
        icon: 'profile.webp' // Optional: add an icon to the notification
      });
    }
  }
}

// Function to play message sound
function playMessageSound(sender) {
  if (sender === 'Doctors Room') {
    messageSentAudio.play();
  } else {
    newMessageAudio.play();
  }
}

// Event listener for the Send button
sendMessageBtn.addEventListener('click', () => {
  const messageText = messageInput.value.trim();
  if (messageText !== '') {
    const sender = 'Doctors Room'; // You can replace 'User' with the actual username or user ID
    const timestamp = new Date().toISOString();
    const message = { text: messageText, sender: sender, timestamp: timestamp };

    // Save the message to Firebase
    push(messagesRef, message)
      .catch((error) => {
        console.error('Error sending message:', error);
      });

    messageInput.value = ''; // Clear the input field
  }
});
// Function to send the message
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== '') {
    const sender = 'Doctors Room'; // You can replace 'User' with the actual username or user ID
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

openChatBtn.addEventListener('click', () => {
  chatOverlay.style.display = 'block'; // Show overlay
  chatContainer.style.display = 'block'; // Show chat container
});

// Close chat on overlay click
chatOverlay.addEventListener('click', () => {
  chatOverlay.style.display = 'none'; // Hide overlay
  chatContainer.style.display = 'none'; // Hide chat container
});



// Function to mute all page sounds
function mutePageSounds(durationInSeconds) {
  // Select all audio elements on the page
  const audioElements = document.querySelectorAll('audio');

  // Mute all audio elements
  audioElements.forEach(audio => {
    audio.muted = true;
  });

  // Unmute after the specified duration
  setTimeout(() => {
    audioElements.forEach(audio => {
      audio.muted = false;
    });
  }, durationInSeconds * 1000);
}

// Call the function to mute page sounds for 5 seconds from page load
window.addEventListener('load', () => {
  mutePageSounds(5); // Mute for 5 seconds
});



document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("appointment");
  const popup = document.getElementById("Apopup");
  const overlay = document.getElementById("overlay3");
  const closePopup = document.getElementById("closeAppPopup");

  // Open the popup
  button.addEventListener("click", function () {
    popup.style.display = "block";
    overlay.style.display = "block";
  });

  // Close the popup
  closePopup.addEventListener("click", function () {
    popup.style.display = "none";
    overlay.style.display = "none";
  });

  // Close the popup when clicking outside the popup
  overlay.addEventListener("click", function () {
    popup.style.display = "none";
    overlay.style.display = "none";
  });
});
// Reference to the Firebase database for patients
const patientSelect = document.getElementById('patientSelect');

// Retrieve patients from Firebase and populate the select options
onValue(patientsRef, (snapshot) => {
  const patientsData = snapshot.val();

  // Clear existing options
  patientSelect.innerHTML = '<option value="" disabled selected>Click to select a patient</option>';

  // Add options for each patient
  if (patientsData) {
    const patients = Object.values(patientsData);
    patients.forEach((patient) => {
      const option = document.createElement('option');
      option.value = patient.patientId; // Set the patient's ID as the value
      option.textContent = `${patient.name} (ID: ${patient.patientId})`; // Display patient name and ID
      option.dataset.dob = patient.dob; // Add DOB as a custom data attribute (if needed)
      patientSelect.appendChild(option);
    });
  }
});


const appointmentsRef = ref(database, "appointments");

// Get the form and handle its submission
const appointmentForm = document.getElementById("appointmentForm");

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  // Get form data
  const appointmentName = document.getElementById("appointmentName").value;
  const appointmentDate = document.getElementById("appointmentDate").value;
  const appointmentTime = document.getElementById("appointmentTime").value;
  const patientId = document.getElementById("patientSelect").value;
  const patientName =
    document.getElementById("patientSelect").options[
      document.getElementById("patientSelect").selectedIndex
    ].text;

  // Validate form data (optional, but recommended)
  if (!appointmentName || !appointmentDate || !appointmentTime || !patientId) {
    alert("All fields are required.");
    return;
  }

  // Create an appointment object
  const newAppointment = {
    appointmentName,
    appointmentDate,
    appointmentTime,
    patientId,
    patientName,
    createdAt: new Date().toISOString(), // Optional: Add a timestamp
  };

  // Save the appointment to Firebase
  push(appointmentsRef, newAppointment)
    .then(() => {
      alert("Appointment saved successfully!");
      // Optionally, clear the form and hide the popup
      appointmentForm.reset();
      document.getElementById("Apopup").style.display = "none";
      document.getElementById("overlay3").style.display = "none";

    })
    .catch((error) => {
      console.error("Error saving appointment:", error);
      alert("Failed to save the appointment. Please try again.");
    });
});

// Close popup event listener
const closeBtn = document.getElementById("closeAppPopup");
closeBtn.addEventListener("click", () => {
  document.getElementById("Apopup").style.display = "none";
});


// Get the table body element
const appointmentsTableBody = document.querySelector("#appointmentsTable tbody");

// Retrieve appointments from Firebase and display them
onValue(appointmentsRef, (snapshot) => {
  const appointmentsData = snapshot.val();

  // Clear the table body
  appointmentsTableBody.innerHTML = "";

  // Check if there are any appointments
  if (appointmentsData) {
    // Show browser notification for upcoming appointments
    if (Notification.permission === "granted") {
      // Create and show the notification
      new Notification("Upcoming Appointments", {
        body: "You have some upcoming appointments to follow!",
        icon: "icon_url.png",  // You can replace this with an actual icon URL
      });
    } else if (Notification.permission !== "denied") {
      // Request permission if it's not already denied
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Create and show the notification
          new Notification("Upcoming Appointments", {
            body: "You have some upcoming appointments to follow!",
            icon: "icon_url.png",  // You can replace this with an actual icon URL
          });
        }
      });
    }

    // Iterate through the appointments and populate the table
    Object.values(appointmentsData).forEach((appointment) => {
      const row = document.createElement("tr");

      // Create table cells for appointment details
      const nameCell = document.createElement("td");
      nameCell.textContent = appointment.appointmentName;

      const patientCell = document.createElement("td");
      patientCell.textContent = appointment.patientName;

      const dateCell = document.createElement("td");
      dateCell.textContent = appointment.appointmentDate;

      const timeCell = document.createElement("td");
      timeCell.textContent = appointment.appointmentTime;

      // Append cells to the row
      row.appendChild(nameCell);
      row.appendChild(patientCell);
      row.appendChild(dateCell);
      row.appendChild(timeCell);

      // Append the row to the table body
      appointmentsTableBody.appendChild(row);
    });
  } else {
    // Display a message if no appointments are found
    const row = document.createElement("tr");
    const noDataCell = document.createElement("td");
    noDataCell.textContent = "No appointments found.";
    noDataCell.colSpan = 4; // Spanning all columns
    noDataCell.style.textAlign = "center";
    row.appendChild(noDataCell);
    appointmentsTableBody.appendChild(row);
  }
});



const displayFutureFollowUps = () => {
  // Reference to all patients' tests
  const patientsRef = ref(database, 'patients');
  
  // Get all patient data
  get(patientsRef)
    .then((snapshot) => {
      const patientsData = snapshot.val();
      const futureFollowUps = [];

      // Loop through all patients
      if (patientsData) {
        Object.entries(patientsData).forEach(([patientId, patientData]) => {
          // Loop through the patient's tests
          Object.entries(patientData.testsTaken || {}).forEach(([testId, testData]) => {
            // Check if the followUpDateTime exists and is in the future
            const followUpDateTime = testData.results && testData.results.followUpDateTime;
            if (followUpDateTime) {
              const followUpDate = new Date(followUpDateTime);
              const currentDate = new Date();

              if (followUpDate > currentDate) {
                // If follow-up date is in the future, add it to the list
                futureFollowUps.push({
                  patientName: patientData.name,
                  parents: patientData.parents,
                  testName: testData.testsTaken,
                  followUpDateTime: followUpDateTime
                });
              }
            }
          });
        });
      }

      // Display the future follow-ups in a designated container
      displayFollowUps(futureFollowUps);
    })
    .catch((error) => {
      console.error('Error fetching patient data:', error);
    });
};
const displayFollowUps = (followUps) => {
  // Reference to the container where the follow-up dates will be displayed
  const followUpContainer = document.getElementById('futureFollowUpsContainer');
  
  // Clear the container before displaying new data
  followUpContainer.innerHTML = '';

  // Create a table element
  const followUpTable = document.createElement('table');
  followUpTable.classList.add('follow-up-table');
  followUpTable.style.width = '100%';
  followUpTable.style.borderCollapse = 'collapse';

  // Create table header row
  const headerRow = document.createElement('tr');
  const headers = ['Patient Name', 'Test Name', 'Follow-up Date & Time', 'Contact'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.border = '1px solid #ddd';
    th.style.padding = '8px';
    th.style.textAlign = 'left';
    headerRow.appendChild(th);
  });
  followUpTable.appendChild(headerRow);

  if (followUps.length > 0) {
    followUps.forEach((followUp) => {
      // Create a new independent row for each follow-up
      const row = document.createElement('tr');
      row.classList.add('follow-up-row'); // Add a specific class to each row for independent styling

      // Patient Name Column
      const patientNameCell = document.createElement('td');
      patientNameCell.textContent = followUp.patientName;
      patientNameCell.style.border = '1px solid #ddd';
      patientNameCell.style.padding = '8px';
      patientNameCell.style.textAlign = 'center'; // You can add text alignment to customize
      row.appendChild(patientNameCell);

      // Test Name Column
      const testNameCell = document.createElement('td');
      testNameCell.textContent = followUp.testName;
      testNameCell.style.border = '1px solid #ddd';
      testNameCell.style.padding = '8px';
      testNameCell.style.textAlign = 'center';
      row.appendChild(testNameCell);

      // Follow-up Date & Time Column
      const followUpDateCell = document.createElement('td');
      followUpDateCell.textContent = new Date(followUp.followUpDateTime).toLocaleString();
      followUpDateCell.style.border = '1px solid #ddd';
      followUpDateCell.style.padding = '8px';
      followUpDateCell.style.textAlign = 'center';
      row.appendChild(followUpDateCell);

      // Contact Column
      const contactCell = document.createElement('td');
      contactCell.textContent = followUp.parents || 'No Contact Info'; // Display contact info or a fallback message
      contactCell.style.border = '1px solid #ddd';
      contactCell.style.padding = '8px';
      contactCell.style.textAlign = 'center';
      row.appendChild(contactCell);

      // Append the row to the table
      followUpTable.appendChild(row);
    });

    // Append the table to the container
    followUpContainer.appendChild(followUpTable);
  } else {
    // If no future follow-ups are found
    followUpContainer.innerHTML = 'No upcoming follow-up appointments.';
  }
};


// Call the function when the page loads
window.addEventListener('load', () => {
  displayFutureFollowUps();
});
const showFollowUpsBtn = document.getElementById('showFollowUpsButton');
showFollowUpsBtn.addEventListener('click', () => {
  displayFutureFollowUps();
});
// ----------------------
// DOM Elements
// ----------------------
const investigationsSelect = document.getElementById('investigations');
const investigationDetails = document.getElementById('investigationDetails');
const investigationPrice = document.getElementById('investigationPrice');
const investigationSearch = document.getElementById('investigationSearch');

const proceduresSelect = document.getElementById('procedures');
const procedureDetails = document.getElementById('procedureDetails');
const procedurePrice = document.getElementById('procedurePrice');
const procedureSearch = document.getElementById('procedureSearch');


const servicePrice = document.getElementById('servicePrice');
const serviceSearch = document.getElementById('serviceSearch');

// ----------------------
// Data holders
// ----------------------
let investigations = {}; // { category: [tests] }
let procedures = {};     // { category: [tests] }
let services = {};       // { category: [tests] }
let selectedInvestigations = [];
let selectedProcedures = [];
let selectedServices = [];
document.getElementById('addInvestigationBtn').addEventListener('click', () => {
  const option = investigationDetails.options[investigationDetails.selectedIndex];
  if (!option) return;

  selectedInvestigations.push({
    name: option.value,
    price: option.dataset.price,
    category: option.dataset.category || investigationsSelect.value || 'Uncategorized'
  });

  renderSelectedList('investigationList', selectedInvestigations);
});

document.getElementById('addProcedureBtn').addEventListener('click', () => {
  const option = procedureDetails.options[procedureDetails.selectedIndex];
  if (!option) return;

  selectedProcedures.push({
    name: option.value,
    price: option.dataset.price,
    category: option.dataset.category || proceduresSelect.value || 'Uncategorized'
  });

  renderSelectedList('procedureList', selectedProcedures);
});

document.getElementById('addServiceBtn').addEventListener('click', () => {
  const option = serviceDetails.options[serviceDetails.selectedIndex];
  if (!option) return;

  selectedServices.push({
    name: option.value,
    price: option.dataset.price,
    category: option.dataset.category || servicesSelect.value || 'Uncategorized'
  });

  renderSelectedList('serviceList', selectedServices);
});


function renderSelectedList(listId, items) {
  const container = document.getElementById(listId);
  container.innerHTML = '';

  let total = 0;

  items.forEach((item, index) => {
    total += Number(item.price) || 0;

    const div = document.createElement('div');
    div.className = 'selected-item';

    const name = document.createElement('span');
    name.textContent = `${item.name} - UGX ${Number(item.price).toLocaleString()}`;

    const remove = document.createElement('button');
    remove.className = 'remove-btn';
    remove.textContent = '×';
    remove.onclick = () => {
      items.splice(index, 1);
      renderSelectedList(listId, items);
    };

    div.appendChild(name);
    div.appendChild(remove);
    container.appendChild(div);
  });

  // Update total line
  const totalLineId = listId.replace('List', 'Total');
  const totalLine = document.getElementById(totalLineId);
  if (totalLine) {
    totalLine.textContent = `Total: UGX ${total.toLocaleString()}`;
  }
}

// ----------------------

onValue(testsRef, snapshot => {
  const allTests = snapshot.val() || {};

  // Reset category objects
  investigations = {};
  procedures = {};
  services = {};

  Object.values(allTests).forEach(test => {
    if (test.type === 'investigations') {
      if (!investigations[test.category]) investigations[test.category] = [];
      investigations[test.category].push(test);
    } else if (test.type === 'procedures') {
      if (!procedures[test.category]) procedures[test.category] = [];
      procedures[test.category].push(test);
    } else if (test.type === 'services') {
      if (!services[test.category]) services[test.category] = [];
      services[test.category].push(test);
    }
  });

  // Populate main dropdowns
  populateMainDropdown(investigationsSelect, investigations, '-- Select Investigation --');
  populateMainDropdown(proceduresSelect, procedures, '-- Select Procedure --');
  populateMainDropdown(servicesSelect, services, '-- Select Service --');

  // Reset sub-dropdowns & search
  resetSubDropdown(investigationDetails, investigationPrice, investigationSearch);
  resetSubDropdown(procedureDetails, procedurePrice, procedureSearch);
  resetSubDropdown(serviceDetails, servicePrice, serviceSearch);
});

// ----------------------
// Populate main category dropdown
// ----------------------
function populateMainDropdown(selectElement, dataObj, defaultText) {
  selectElement.innerHTML = `<option value="">${defaultText}</option>`;
  Object.keys(dataObj).forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    selectElement.appendChild(option);
  });
}

// ----------------------
// Reset sub-dropdowns
// ----------------------
function resetSubDropdown(subDropdown, priceElement, searchInput) {
  subDropdown.innerHTML = '';
  subDropdown.style.display = 'none';
  priceElement.style.display = 'none';
  searchInput.value = '';
  searchInput.style.display = 'none';
}

// ----------------------
// Handle sub-dropdown population
// ----------------------
function populateSubDropdown(subDropdown, priceElement, testsArray, highlightText = '') {
  subDropdown.innerHTML = '';
  priceElement.style.display = 'none';

  if (testsArray && testsArray.length > 0) {
    testsArray.forEach(test => {
      const option = document.createElement('option');
      option.value = test.name;

      if (highlightText) {
        const regex = new RegExp(`(${highlightText})`, 'gi');
        option.innerHTML = test.name.replace(regex, '<mark>$1</mark>') + ` - UGX ${Number(test.cost).toLocaleString()}`;
      } else {
        option.textContent = `${test.name} - UGX ${Number(test.cost).toLocaleString()}`;
      }

      option.dataset.price = test.cost;
      option.dataset.category = test.category; // <-- ADD THIS
      subDropdown.appendChild(option);
    });
    subDropdown.style.display = 'block';
  } else {
    subDropdown.style.display = 'none';
  }
}


// ----------------------
// Show price when a test is selected
// ----------------------
[investigationDetails, procedureDetails, serviceDetails].forEach(subDropdown => {
  subDropdown.addEventListener('change', () => {
    const selectedOption = subDropdown.options[subDropdown.selectedIndex];
    let priceElement;
    if (subDropdown === investigationDetails) priceElement = investigationPrice;
    else if (subDropdown === procedureDetails) priceElement = procedurePrice;
    else priceElement = servicePrice;

    if (selectedOption && selectedOption.dataset.price != null) {
      priceElement.textContent = `Price: UGX ${Number(selectedOption.dataset.price).toLocaleString()}`;
      priceElement.style.display = 'block';
    } else {
      priceElement.style.display = 'none';
    }
  });
});

// ----------------------
// Category selection -> show search and populate sub-dropdown
// ----------------------
investigationsSelect.addEventListener('change', () => {
  const selectedCategory = investigationsSelect.value;
  investigationSearch.value = '';
  investigationSearch.style.display = selectedCategory ? 'block' : 'none';
  populateSubDropdown(investigationDetails, investigationPrice, investigations[selectedCategory] || []);
});

proceduresSelect.addEventListener('change', () => {
  const selectedCategory = proceduresSelect.value;
  procedureSearch.value = '';
  procedureSearch.style.display = selectedCategory ? 'block' : 'none';
  populateSubDropdown(procedureDetails, procedurePrice, procedures[selectedCategory] || []);
});

servicesSelect.addEventListener('change', () => {
  const selectedCategory = servicesSelect.value;
  serviceSearch.value = '';
  serviceSearch.style.display = selectedCategory ? 'block' : 'none';
  populateSubDropdown(serviceDetails, servicePrice, services[selectedCategory] || []);
});

// ----------------------
// Search/filter functionality
// ----------------------
function filterSubDropdown(subDropdown, priceElement, searchInput, originalTests) {
  const query = searchInput.value.toLowerCase();
  const filtered = originalTests.filter(test => test.name.toLowerCase().includes(query));
  populateSubDropdown(subDropdown, priceElement, filtered, query);
}

investigationSearch.addEventListener('input', () => {
  const selectedCategory = investigationsSelect.value;
  if (!selectedCategory) return;
  filterSubDropdown(investigationDetails, investigationPrice, investigationSearch, investigations[selectedCategory]);
});

procedureSearch.addEventListener('input', () => {
  const selectedCategory = proceduresSelect.value;
  if (!selectedCategory) return;
  filterSubDropdown(procedureDetails, procedurePrice, procedureSearch, procedures[selectedCategory]);
});

serviceSearch.addEventListener('input', () => {
  const selectedCategory = servicesSelect.value;
  if (!selectedCategory) return;
  filterSubDropdown(serviceDetails, servicePrice, serviceSearch, services[selectedCategory]);
});
