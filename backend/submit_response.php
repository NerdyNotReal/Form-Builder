<?php
session_start();
include('db.php');

// Ensure proper content type
header('Content-Type: application/json');

// Get form ID and validate it exists and is published
$formId = $_POST['form_id'] ?? null;

if (!$formId) {
    http_response_code(400);
    echo json_encode(['error' => 'Form ID is required']);
    exit;
}

$formSql = "SELECT id, status FROM forms WHERE id = ? AND status = 'published'";
$stmt = mysqli_prepare($conn, $formSql);
mysqli_stmt_bind_param($stmt, "i", $formId);
mysqli_stmt_execute($stmt);
$formResult = mysqli_stmt_get_result($stmt);
$form = mysqli_fetch_assoc($formResult);

if (!$form) {
    http_response_code(404);
    echo json_encode(['error' => 'Form not found or not published']);
    exit;
}

// Get form elements to validate required fields
$elementsSql = "SELECT id, element_type, is_required FROM form_elements WHERE form_id = ?";
$stmt = mysqli_prepare($conn, $elementsSql);
mysqli_stmt_bind_param($stmt, "i", $formId);
mysqli_stmt_execute($stmt);
$elementsResult = mysqli_stmt_get_result($stmt);
$elements = mysqli_fetch_all($elementsResult, MYSQLI_ASSOC);

// Prepare response data
$responseData = [];

// Validate and collect responses
foreach ($elements as $element) {
    $elementId = $element['id'];
    $fieldName = "element_" . $elementId;
    
    // Handle checkbox arrays
    if ($element['element_type'] === 'checkbox') {
        $value = isset($_POST[$fieldName]) ? $_POST[$fieldName] : [];
    } else {
        $value = $_POST[$fieldName] ?? '';
    }
    
    // Validate required fields
    if ($element['is_required'] && empty($value)) {
        http_response_code(400);
        echo json_encode(['error' => 'Required fields are missing']);
        exit;
    }
    
    $responseData[$fieldName] = $value;
}

try {
    // Start transaction
    mysqli_begin_transaction($conn);

    // Store response in database
    $insertSql = "INSERT INTO form_responses (form_id, response_data) VALUES (?, ?)";
    $stmt = mysqli_prepare($conn, $insertSql);
    $responseJson = json_encode($responseData);
    mysqli_stmt_bind_param($stmt, "is", $formId, $responseJson);
    
    if (mysqli_stmt_execute($stmt)) {
        mysqli_commit($conn);
        echo json_encode([
            'success' => true,
            'message' => 'Form submitted successfully'
        ]);
    } else {
        throw new Exception('Failed to save response: ' . mysqli_error($conn));
    }
} catch (Exception $e) {
    mysqli_rollback($conn);
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

mysqli_close($conn); 