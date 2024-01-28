function openAddFoodModal() {
  // Get the addfood-modal element
  var addFoodModal = document.getElementById('overlay1');

  // Show the modal by changing its display style
  addFoodModal.style.display = 'flex';

  // Prevent the default form submission behavior
  return false;
}

function closeAddFoodModal() {
  // Get the addfood-modal element
  var addFoodModal = document.getElementById('overlay1');

  // Hide the modal by changing its display style
  addFoodModal.style.display = 'none';
}

// Function to adjust the expiry date based on the selected values
function adjustExpiryDate(typeOfFood, typeOfStorage, dateAdded) {
  // Recommended storage days for different types of food and storage
  var recommendedDays = {
      'Freezer': {
          'Meats': 2,
          'Vegetables': 'Not recommended to store here',
          'Fruits': 'Not recommended to store here',
          'Dairy Products': 'Not recommended to store here',
          'Leftovers': 3,
      },
      'Refrigerator': {
          'Meats': 60,
          'Vegetables': 7,
          'Fruits': 7,
          'Dairy Products': 7,
          'Leftovers': 7,
      },
  };

  var adjustedExpiryDate = null;

  if (
      recommendedDays[typeOfStorage] &&
      recommendedDays[typeOfStorage][typeOfFood] !== undefined &&
      isNumeric(recommendedDays[typeOfStorage][typeOfFood])
  ) {
      adjustedExpiryDate = new Date(dateAdded);
      adjustedExpiryDate.setDate(
          adjustedExpiryDate.getDate() + recommendedDays[typeOfStorage][typeOfFood]
      );
      adjustedExpiryDate = adjustedExpiryDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  return adjustedExpiryDate;
}

// Function to check if a value is numeric
function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

// Function to show a confirmation dialog for items not recommended in the freezer
function showFreezerConfirmation() {
  return confirm(
      'Not recommended to store this type of food in the freezer. Do you still want to store here?'
  );
}

// Function to show a confirmation dialog for adjusting the expiry date based on recommendations
function showExpiryDateConfirmation() {
  return confirm('Do you want to follow the recommended storage days starting from the date added?');
}

// Function to display a reminder alert
function displayReminder(typeOfFood, typeOfStorage) {
  var reminderMessage = getReminderMessage(typeOfFood, typeOfStorage);
  if (reminderMessage) {
      alert('Reminder: ' + reminderMessage);
  }
}

// Function to get the reminder message
function getReminderMessage(typeOfFood, typeOfStorage) {
  var recommendedDays = {
      'Freezer': {
          'Meats': 'Recommended storage time: 2 days',
          'Vegetables': 'Not recommended to store here',
          'Fruits': 'Not recommended to store here',
          'Cooked Food': '',
          'Dairy Products': 'Not recommended to store here',
          'Leftovers': 'Recommended storage time: 3 days',
      },
      'Refrigerator': {
          'Meats': 'Recommended storage time: 2 months (~60 days)',
          'Vegetables': 'Recommended storage time: 1 week (~7 days)',
          'Fruits': 'Recommended storage time: 1 week (~7 days)',
          'Cooked Food': '',
          'Dairy Products': 'Recommended storage time: 1 week (~7 days)',
          'Leftovers': 'Recommended storage time: 1 week (~7 days)',
      },
  };

  return (
      recommendedDays[typeOfStorage] &&
      recommendedDays[typeOfStorage][typeOfFood] !== undefined
          ? recommendedDays[typeOfStorage][typeOfFood]
          : ''
  );
}

// Flag to track whether the reminder has been shown
var reminderAlreadyShown = false;

// Function to add an item
function addItem() {
  // Get item details from the form
  var itemName = document.getElementById('itemName').value;
  var dateAdded = document.getElementById('dateAdded').value;
  var expiryDate = document.getElementById('expiryDate').value;
  var quantity = document.getElementById('quantity').value;

  // Get values from the new dropdowns
  var typeOfFood = document.getElementById('typeOfFood').value;
  var typeOfStorage = document.getElementById('typeOfStorage').value;

  // Check if the reminder has already been shown
  if (!reminderAlreadyShown) {
      // Display the reminder below the Type of Storage dropdown
      displayReminder(typeOfFood, typeOfStorage);
  }

  // Check if the expiry date is earlier than the date added
  if (new Date(expiryDate) < new Date(dateAdded)) {
      // Show an alert and do not proceed with adding the item
      alert('Expiry date cannot be earlier than the date added. Please enter a valid expiry date.');
      return;
  }

  // Check if the item is recommended to store in the freezer
  if (typeOfStorage === 'Freezer' && (typeOfFood === 'Vegetables' || typeOfFood === 'Fruits' || typeOfFood === 'Dairy Products')) {
      // Show confirmation dialog
      var confirmation = showFreezerConfirmation();

      if (!confirmation) {
          // User clicked Cancel, do not proceed with adding the item
          return;
      }
  } else if (expiryDate) {
      // If expiryDate is provided, show a confirmation dialog
      var useRecommendedDays = showExpiryDateConfirmation();

      if (useRecommendedDays) {
          // Adjust the expiry date based on the recommended days
          expiryDate = adjustExpiryDate(typeOfFood, typeOfStorage, dateAdded);
          reminderAlreadyShown = true; // Set the flag to true after showing the reminder
      }
  }

  // Handle file upload
  var fileInput = document.getElementById('file');
  var foodImage = fileInput.files[0];

  // Create FormData to send the file and other form data
  var formData = new FormData();
  formData.append('foodImage', foodImage);
  formData.append('itemName', itemName);
  formData.append('dateAdded', dateAdded);
  formData.append('expiryDate', expiryDate);
  formData.append('quantity', quantity);
  formData.append('typeOfFood', typeOfFood);
  formData.append('typeOfStorage', typeOfStorage);

  // Include file data in the fetch request
  fetch('save_item.php', {
      method: 'POST',
      body: formData,
  })
  .then(response => response.json())
  // Inside the fetch response handling
  .then(data => {
      if (data.status === 'success') {
          // Item added successfully
          alert(data.message);
          // Display the uploaded image
          displayImage(data.imagePath);
          // Display the generated itemId in the console
          console.log('Generated itemId:', data.itemId);
          // Clear the form using the clearForm function
          clearForm();
      } else {
          // Error occurred, show alert with the error message
          alert(data.message);
      }
  })
  .catch(error => {
      console.error('Error adding item:', error);
  });
}

// Function to display the uploaded image immediately
function displayImageImmediately() {
  var fileInput = document.getElementById('file');
  
  // Check if a file is selected
  if (fileInput.files.length > 0) {
      var uploadedImage = document.getElementById('uploadedImage');
      var reader = new FileReader();

      reader.onload = function (e) {
          uploadedImage.src = e.target.result;
          uploadedImage.style.width = '200px'; // Set a fixed width
          uploadedImage.style.height = '200px'; // Set a fixed height
          uploadedImage.style.display = 'block'; // Display the image
      };

      reader.readAsDataURL(fileInput.files[0]);
  }
}

// Function to cancel image upload
function cancelImageUpload() {
  // Reset the file input
  document.getElementById('file').value = '';

  // Clear the displayed image
  var uploadedImage = document.getElementById('uploadedImage');
  uploadedImage.src = '';
  uploadedImage.style.display = 'none';
}



// Function to display the uploaded image
function displayImage(imagePath) {
  // Assuming you have an element with ID "uploadedImage" where you want to show the image
  var uploadedImage = document.getElementById('uploadedImage');

  // Clear previous image
  uploadedImage.src = '';
  uploadedImage.style.display = 'none';

  // Create a new image element
  var img = document.createElement('img');
  img.id = 'uploadedImage';
  img.alt = 'Uploaded Image';

  // Set the source of the image to the uploaded file
  img.src = imagePath;

  // Apply styles to ensure consistent sizing
  img.style.width = '150px'; // Adjust the width as needed
  img.style.height = '150px'; // Adjust the height as needed
  img.style.display = 'block';
  img.style.margin = '10px 0';

  // Append the image to the display element
  uploadedImage.parentNode.insertBefore(img, uploadedImage.nextSibling);

  // Update the "uploadedImage" reference to the new image
  uploadedImage = img;
}



function searchInventory() {
  var searchTerm = document.getElementById('searchTerm').value;
  var startDate = document.getElementById('startDate').value;
  var endDate = document.getElementById('endDate').value;

  // Determine whether to use search term or not
  var searchURL = 'search_inventory.php?term=' + encodeURIComponent(searchTerm);

  // If start and end dates are provided, add them to the URL
  if (startDate && endDate) {
      searchURL += '&startDate=' + encodeURIComponent(startDate) + '&endDate=' + encodeURIComponent(endDate);
  }

  // Using fetch API for simplicity (modern browsers)
  fetch(searchURL)
      .then(response => response.json())
      .then(results => {
          // Display search results on the webpage
          displaySearchResultsTable(results);
      })
      .catch(error => {
          console.error('Error searching inventory:', error);
      });
}


// Example function to display all data
function displayAllData() {
  fetch('search_inventory.php')
      .then(response => response.json())
      .then(results => {
          console.log(results);  // Log the results to the console
          displaySearchResultsTable(results);
      })
      .catch(error => {
          console.error('Error fetching all data:', error);
      });
}


// Function to display search results with action buttons
function displaySearchResultsTable(results) {
  var resultsTable = document.getElementById('resultsTable');
  var tbody = resultsTable.querySelector('tbody');

  // If tbody doesn't exist, create one
  if (!tbody) {
      tbody = document.createElement('tbody');
      resultsTable.appendChild(tbody);
  }

  // Clear previous results
  tbody.innerHTML = '';

  var headers = ['Type of Food', 'Type of Storage', 'Food Name', 'Date Added', 'Expiry Date', 'Quantity'];
  headers.push('Actions'); // Add 'Actions' header

  // Create table header if not exists
  if (!resultsTable.tHead) {
      var tableHeader = resultsTable.createTHead();
      var row = tableHeader.insertRow();
      headers.forEach(headerText => {
          var th = document.createElement('th');
          th.textContent = headerText;
          row.appendChild(th);
      });
  }

  if (results.length === 0) {
      // No matching items found
      var noResultsRow = tbody.insertRow();
      var noResultsCell = noResultsRow.insertCell();
      noResultsCell.colSpan = headers.length;
      noResultsCell.textContent = 'No matching items found.';
  } else {
      // Populate table with results
      results.forEach(result => {
          var tableRow = tbody.insertRow();
          tableRow.insertCell().textContent = result.typeOfFood;
          tableRow.insertCell().textContent = result.typeOfStorage;
          tableRow.insertCell().textContent = result.itemName;
          tableRow.insertCell().textContent = result.dateAdded;
          tableRow.insertCell().textContent = result.expiryDate;
          tableRow.insertCell().textContent = result.quantity;

          // Add action buttons to the row with the correct itemId
          appendActionButtons(tableRow, result.itemId);
      });
  }
}


// Function to create action buttons in the table
function createActionButtons(itemId) {
  const viewButton = `<button onclick="viewItem(${itemId})">View</button>`;
  const editButton = `<button onclick="editItem(${itemId})">Edit</button>`;
  const deleteButton = `<button onclick="deleteItem(${itemId})">Delete</button>`;
  return `${viewButton} ${editButton} ${deleteButton}`;
}

// Function to create and append action buttons to the table
function appendActionButtons(row, itemId) {
  const cell = row.insertCell();

  // Create view, edit, and delete buttons with onclick attributes
  const viewButton = document.createElement('button');
  viewButton.textContent = 'View';
  viewButton.onclick = function() {
      viewItem(itemId);
  };

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.onclick = function() {
      editItem(itemId);
  };

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = function() {
      deleteItem(itemId);
  };

  // Append buttons to the cell
  cell.appendChild(viewButton);
  cell.appendChild(editButton);
  cell.appendChild(deleteButton);

}




// Function to handle viewing an item
function viewItem(itemId) {
  // Fetch item details using itemId and display in a modal
  alert('View Item: ' + itemId);

}

// Function to handle editing an item
function editItem(itemId) {
  // Implement your logic for editing an item
  alert('Edit Item: ' + itemId);
}

// Function to handle deleting an item
function deleteItem(itemId) {
  alert('Delete Item: ' + itemId);
}


function clearSearchInputs() {
  document.getElementById('searchTerm').value = '';
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
}

// Function to clear the form after successful item addition
function clearForm() {
  document.getElementById('addItemForm').reset();
  document.getElementById('uploadedImage').src = '';
  document.getElementById('uploadedImage').style.display = 'none';
  reminderAlreadyShown = false; // Reset the reminder flag
}
