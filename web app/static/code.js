function openModal(id,itemName) {
  // Get the modal element
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

function addValidation(){

  let a = document.forms["addItem"]["foodQuantity"].value;
    if (a <= 0) {
      alert("The quantity of the food must be more than 0.")
      return false;
    }
  let x = new Date(document.forms["addItem"]["foodExpDate"].value);
    if ( isNaN(x)) {
        alert("Please insert the expiry date.");
      return false;
    }

  let y = document.forms["addItem"]["foodPhoto"].value;
    if (y == "") {
      alert("Please upload the photo of the food.");
      return false;
    }
    if (y && y['type'].split('/')[0] != 'image') {
      alert("Please make sure the file is an image.")
      return false;
    }

}

function modifyValidation(){

  let a = document.forms["modifyItem"]["foodQuantity"].value;
    if (a <= 0) {
      alert("The quantity of the food must be more than 0.")
      return false;
    }
  let x = new Date(document.forms["modifyItem"]["foodExpDate"].value);
    if ( isNaN(x)) {
        alert("Please insert the expiry date.");
      return false;
    }

  if(!(confirm("Do you really want to modify the data?"))){
    return false;
  }

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
