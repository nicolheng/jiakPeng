function openModal(id,itemName) {
  // Get the addfood-modal element
  var modal = document.getElementById(id,itemName);

  // Show the modal by changing its display style
  modal.style.display = 'flex';

  //change url name
  if (id == 'overlay1') {
    window.history.pushState(id,'', '/add');
  } else{
    window.history.pushState(id,'', '/'+id);
  }

  // Prevent the default form submission behavior
  return false;
}

function closeModal(id) {
  // Get the addfood-modal element
  var viewFoodModal = document.getElementById(id);

  // Hide the modal by changing its display style
  viewFoodModal.style.display = 'none';

  //change url name
  window.history.pushState('','', '/');

  return false;
}

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

// Function to clear the form after successful item addition
function clearForm() {
  document.getElementById('addItemForm').reset();
  document.getElementById('uploadedImage').src = '';
  document.getElementById('uploadedImage').style.display = 'none';
  reminderAlreadyShown = false; // Reset the reminder flag
}