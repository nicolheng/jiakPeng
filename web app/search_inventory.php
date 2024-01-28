<?php
// Include database connection logic (you can create a separate file for it)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "inventory_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the search term from the URL parameter
$searchTerm = isset($_GET['term']) ? $_GET['term'] : '';

// Format the search term for the SQL query
$searchTerm = '%' . $searchTerm . '%';

// TODO: Modify the search query to include the search term
$sql = "SELECT * FROM inventory WHERE itemName LIKE ? OR typeOfFood LIKE ? OR typeOfStorage LIKE ?";

// Use a prepared statement to prevent SQL injection
$stmt = $conn->prepare($sql);
$stmt->bind_param('sss', $searchTerm, $searchTerm, $searchTerm);
$stmt->execute();

$result = $stmt->get_result();

// Check if there are any results
if ($result->num_rows > 0) {
    // Fetch results and store in an array
    $searchResults = [];
    while ($row = $result->fetch_assoc()) {
        $searchResults[] = [
            'typeOfFood' => $row['typeOfFood'],
            'typeOfStorage' => $row['typeOfStorage'],
            'itemName' => $row['itemName'],
            'dateAdded' => $row['dateAdded'],
            'expiryDate' => $row['expiryDate'],
            'quantity' => $row['quantity'],
        ];
    }

    // Respond with search results in JSON format
    header('Content-Type: application/json');
    echo json_encode($searchResults);
} else {
    // No matching items found
    echo json_encode([]);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Close the prepared statement and database connection
$stmt->close();
$conn->close();
?>
