<?php
session_start();
include('db.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$formId = $data['formId'];
$formElements = $data['formElements'];

try {
    // Start transaction
    mysqli_begin_transaction($conn);

    // Update form status to published
    $updateFormSql = "UPDATE forms SET status = 'published' WHERE id = ? AND owner_id = ?";
    $stmt = mysqli_prepare($conn, $updateFormSql);
    mysqli_stmt_bind_param($stmt, "ii", $formId, $_SESSION['user_id']);
    mysqli_stmt_execute($stmt);

    // Delete existing form elements
    $deleteElementsSql = "DELETE FROM form_elements WHERE form_id = ?";
    $stmt = mysqli_prepare($conn, $deleteElementsSql);
    mysqli_stmt_bind_param($stmt, "i", $formId);
    mysqli_stmt_execute($stmt);

    // Insert new form elements
    $insertElementSql = "INSERT INTO form_elements (form_id, element_type, label, is_required, position, properties) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $insertElementSql);

    foreach ($formElements as $index => $element) {
        $elementType = $element['type'];
        $label = $element['label'];
        $isRequired = $element['required'] ?? false;
        $position = $index;
        $properties = json_encode($element['properties'] ?? []);

        mysqli_stmt_bind_param($stmt, "issiis", $formId, $elementType, $label, $isRequired, $position, $properties);
        mysqli_stmt_execute($stmt);
    }

    // Commit transaction
    mysqli_commit($conn);

    // Generate the public URL
    $publicUrl = sprintf(
        "%s://%s/formbuilder/templates/form.php?id=%s",
        isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
        $_SERVER['SERVER_NAME'],
        $formId
    );

    echo json_encode([
        'success' => true,
        'message' => 'Form published successfully',
        'publicUrl' => $publicUrl
    ]);

} catch (Exception $e) {
    mysqli_rollback($conn);
    http_response_code(500);
    echo json_encode(['error' => 'Failed to publish form: ' . $e->getMessage()]);
}

mysqli_close($conn); 