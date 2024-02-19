/* Function to adjust the expiry date based on the selected values
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
*/
  
/* Function to check if a value is numeric
function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}
*/

/* Function to show a confirmation dialog for items not recommended in the freezer
function showFreezerConfirmation() {
  return confirm(
      'Not recommended to store this type of food in the freezer. Do you still want to store here?'
  );
}
*/

/* Function to show a confirmation dialog for adjusting the expiry date based on recommendations
function showExpiryDateConfirmation() {
  return confirm('Do you want to follow the recommended storage days starting from the date added?');
}
*/

/* Function to display a reminder alert
function displayReminder(typeOfFood, typeOfStorage) {
  var reminderMessage = getReminderMessage(typeOfFood, typeOfStorage);
  if (reminderMessage) {
      alert('Reminder: ' + reminderMessage);
  }
}
*/

/* Function to get the reminder message
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
*/
/* Flag to track whether the reminder has been shown
var reminderAlreadyShown = false;
*/

/*
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

*/

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