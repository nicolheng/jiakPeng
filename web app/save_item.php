<?php
define('UPLOAD_DIR', 'foodImg_toBeUploaded/');

function adjustExpiryDate($typeOfFood, $typeOfStorage, $dateAdded) {
    $recommendedDays = [
        'Freezer' => [
            'Meats' => 2,
            'Vegetables' => 'Not recommended to store here',
            'Fruits' => 'Not recommended to store here',
            'Dairy Products' => 'Not recommended to store here',
            'Leftovers' => 3,
        ],
        'Refrigerator' => [
            'Meats' => 60,
            'Vegetables' => 7,
            'Fruits' => 7,
            'Dairy Products' => 7,
            'Leftovers' => 7,
        ],
    ];

    $adjustedExpiryDate = null;

    if (isset($recommendedDays[$typeOfStorage][$typeOfFood]) && is_numeric($recommendedDays[$typeOfStorage][$typeOfFood])) {
        $date = new DateTime($dateAdded);
        $date->add(new DateInterval('P' . $recommendedDays[$typeOfStorage][$typeOfFood] . 'D'));
        $adjustedExpiryDate = $date->format('Y-m-d');
    }

    return $adjustedExpiryDate;
}

// Function to generate UUID
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "inventory_db";

$uploadDir = UPLOAD_DIR;

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Get the generated UUID for the current item
$itemId = generateUUID();
error_log("Generated UUID: " . $itemId);  // Log the UUID to the error log

$foodImage = $_FILES['foodImage'];

if (!empty($foodImage['name'])) {
    $fileName = basename($foodImage['name']);
    $targetPath = $uploadDir . $fileName;

    move_uploaded_file($foodImage['tmp_name'], $targetPath);
} else {
    $targetPath = '';
}

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$itemName = filter_var($_POST['itemName'], FILTER_SANITIZE_STRING);
$dateAdded = filter_var($_POST['dateAdded'], FILTER_SANITIZE_STRING);
$quantity = filter_var($_POST['quantity'], FILTER_SANITIZE_NUMBER_INT);
$typeOfFood = filter_var($_POST['typeOfFood'], FILTER_SANITIZE_STRING);
$typeOfStorage = filter_var($_POST['typeOfStorage'], FILTER_SANITIZE_STRING);
$expiryDate = isset($_POST['expiryDate']) ? $_POST['expiryDate'] : null;

$adjustedExpiryDate = adjustExpiryDate($typeOfFood, $typeOfStorage, $dateAdded);
$expiryDate = $expiryDate ? $expiryDate : $adjustedExpiryDate;

$sql = "INSERT INTO inventory (itemId, itemName, dateAdded, expiryDate, quantity, typeOfFood, typeOfStorage, foodImage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param('ssssssss', $itemId, $itemName, $dateAdded, $expiryDate, $quantity, $typeOfFood, $typeOfStorage, $targetPath);

$response = array();

if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = 'Item added successfully';
    $response['imagePath'] = $targetPath;
    $response['itemId'] = $itemId; // Include itemId in the response
} else {
    $response['status'] = 'error';
    $response['message'] = 'Error: ' . htmlspecialchars($stmt->error);
    $response['imagePath'] = ''; // Set imagePath to empty in case of an error
}

$stmt->close();
$conn->close();

// Send the JSON response and exit to prevent additional output
header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT);
exit;
