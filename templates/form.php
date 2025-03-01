<?php
include('../backend/db.php');

// Get form ID from URL
$formId = isset($_GET['id']) ? $_GET['id'] : null;

if (!$formId) {
    die('Form ID is required');
}

// Get form details
$formSql = "SELECT f.*, u.username as creator FROM forms f 
            JOIN users u ON f.owner_id = u.id 
            WHERE f.id = ? AND f.status = 'published'";
$stmt = mysqli_prepare($conn, $formSql);
mysqli_stmt_bind_param($stmt, "i", $formId);
mysqli_stmt_execute($stmt);
$formResult = mysqli_stmt_get_result($stmt);
$form = mysqli_fetch_assoc($formResult);

if (!$form) {
    die('Form not found or not published');
}

// Get form elements
$elementsSql = "SELECT * FROM form_elements WHERE form_id = ? ORDER BY position";
$stmt = mysqli_prepare($conn, $elementsSql);
mysqli_stmt_bind_param($stmt, "i", $formId);
mysqli_stmt_execute($stmt);
$elementsResult = mysqli_stmt_get_result($stmt);
$elements = mysqli_fetch_all($elementsResult, MYSQLI_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($form['title']); ?></title>
    <link rel="stylesheet" href="../public/css/theme.css">
    <link rel="stylesheet" href="../public/css/utilities.css">
    <style>
        body {
            background-color: var(--color-neutrals-94);
            margin: 0;
            padding: 20px;
            font-family: 'Inter', sans-serif;
        }

        .form-container {
            max-width: 640px;
            margin: 40px auto;
        }

        .form-header {
            background-color: var(--color-primary-94);
            border: 1px solid var(--color-neutrals-16);
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
        }

        .form-title {
            font-size: 32px;
            color: var(--color-primary-52);
            margin: 0 0 16px 0;
            font-weight: 400;
        }

        .form-description {
            color: var(--color-neutrals-50);
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
        }

        .form-element {
            background: #fff;
            border: 1px solid var(--color-neutrals-16);
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            transition: box-shadow 0.2s ease;
        }

        .form-element:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .element-label {
            font-size: 16px;
            color: var(--color-neutrals-2);
            margin-bottom: 8px;
            font-weight: 500;
        }

        .required {
            color: var(--color-sementic-red);
            margin-left: 4px;
        }

        .element-description {
            font-size: 12px;
            color: var(--color-neutrals-50);
            margin: 8px 0 16px;
        }

        .form-input {
            width: 100%;
            padding: 8px 12px;
            font-size: 14px;
            border: 1px solid var(--color-neutrals-16);
            border-radius: 4px;
            background-color: #fff;
            color: var(--color-neutrals-2);
            box-sizing: border-box;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--color-primary-52);
            box-shadow: 0 0 0 2px var(--color-primary-94);
        }

        textarea.form-input {
            min-height: 120px;
            resize: vertical;
        }

        .radio-option,
        .checkbox-option {
            margin: 12px 0;
        }

        .radio-option label,
        .checkbox-option label {
            margin-left: 8px;
            color: var(--color-neutrals-2);
            font-size: 14px;
        }

        .submit-button {
            display: inline-block;
            padding: 10px 24px;
            background-color: var(--color-primary-52);
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .submit-button:hover {
            background-color: var(--color-primary-86);
        }

        .error-message {
            color: var(--color-sementic-red);
            font-size: 12px;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="form-header">
            <h1 class="form-title"><?php echo htmlspecialchars($form['title']); ?></h1>
            <?php if ($form['description']): ?>
                <p class="form-description"><?php echo htmlspecialchars($form['description']); ?></p>
            <?php endif; ?>
        </div>

        <form id="publishedForm" method="POST" action="../backend/submit_response.php">
            <input type="hidden" name="form_id" value="<?php echo $formId; ?>">
            
            <?php foreach ($elements as $element): ?>
                <div class="form-element">
                    <label class="element-label">
                        <?php echo htmlspecialchars($element['label']); ?>
                        <?php if ($element['is_required']): ?>
                            <span class="required">*</span>
                        <?php endif; ?>
                    </label>

                    <?php
                    $properties = json_decode($element['properties'], true);
                    if (isset($properties['description'])): ?>
                        <div class="element-description"><?php echo htmlspecialchars($properties['description']); ?></div>
                    <?php endif; ?>

                    <?php
                    switch ($element['element_type']):
                        case 'text':
                        case 'email':
                        case 'number':
                        case 'date':
                        case 'time':
                            ?>
                            <input 
                                type="<?php echo $element['element_type']; ?>"
                                name="element_<?php echo $element['id']; ?>"
                                class="form-input"
                                <?php echo $element['is_required'] ? 'required' : ''; ?>
                                <?php echo isset($properties['placeholder']) ? 'placeholder="'.htmlspecialchars($properties['placeholder']).'"' : ''; ?>
                            >
                            <?php
                            break;
                        
                        case 'textarea':
                            ?>
                            <textarea 
                                name="element_<?php echo $element['id']; ?>"
                                class="form-input"
                                <?php echo $element['is_required'] ? 'required' : ''; ?>
                                <?php echo isset($properties['placeholder']) ? 'placeholder="'.htmlspecialchars($properties['placeholder']).'"' : ''; ?>
                            ></textarea>
                            <?php
                            break;
                        
                        case 'select':
                            ?>
                            <select 
                                name="element_<?php echo $element['id']; ?>"
                                class="form-input"
                                <?php echo $element['is_required'] ? 'required' : ''; ?>
                            >
                                <option value="">Select an option</option>
                                <?php foreach ($properties['options'] as $option): ?>
                                    <option value="<?php echo htmlspecialchars($option['value']); ?>">
                                        <?php echo htmlspecialchars($option['label']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <?php
                            break;
                        
                        case 'radio':
                            foreach ($properties['options'] as $option): ?>
                                <div class="radio-option">
                                    <input 
                                        type="radio"
                                        name="element_<?php echo $element['id']; ?>"
                                        value="<?php echo htmlspecialchars($option['value']); ?>"
                                        <?php echo $element['is_required'] ? 'required' : ''; ?>
                                    >
                                    <label><?php echo htmlspecialchars($option['label']); ?></label>
                                </div>
                            <?php
                            endforeach;
                            break;
                        
                        case 'checkbox':
                            foreach ($properties['options'] as $option): ?>
                                <div class="checkbox-option">
                                    <input 
                                        type="checkbox"
                                        name="element_<?php echo $element['id']; ?>[]"
                                        value="<?php echo htmlspecialchars($option['value']); ?>"
                                    >
                                    <label><?php echo htmlspecialchars($option['label']); ?></label>
                                </div>
                            <?php
                            endforeach;
                            break;
                    endswitch;
                    ?>
                    <div class="error-message"></div>
                </div>
            <?php endforeach; ?>

            <button type="submit" class="submit-button">Submit</button>
        </form>
    </div>

    <script>
        document.getElementById('publishedForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
                const response = await fetch('../backend/submit_response.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Form submitted successfully!');
                    this.reset();
                } else {
                    alert(result.error || 'Failed to submit form');
                }
            } catch (error) {
                alert('Failed to submit form: ' + error.message);
            }
        });
    </script>
</body>
</html> 