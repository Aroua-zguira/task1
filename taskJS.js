var fields = [];

function addField(type) {
    var fieldId = 'field-' + fields.length;
    var fieldName = prompt('Enter field name:');
    if (!fieldName) return;

    var fieldValues;
    if (type === 'select') {
        fieldValues = prompt('Enter comma-separated values for the select field:');
        if (!fieldValues) return;
        fieldValues = fieldValues.split(',').map(value => value.trim());
    }

    fields.push({ id: fieldId, name: fieldName, type: type, values: fieldValues });
    
    var fieldHTML = '';
    if (type === 'text') {
        fieldHTML = '<input type="text" id="' + fieldId + '" placeholder="' + fieldName + '">';
    } else if (type === 'select') {
        fieldHTML = '<select id="' + fieldId + '"><option value="">Select ' + fieldName + '</option>';
        fieldValues.forEach(value => {
            fieldHTML += '<option value="' + value + '">' + value + '</option>';
        });
        fieldHTML += '</select>';
    }

    $('#form-fields').append('<div>' + fieldHTML + '<button class="remove" type="button" onclick="removeField(\'' + fieldId + '\')">X</button></div>');

    // Check if the fields array is not empty
    if (fields.length > 0 && $('#save-button').length === 0) {
        $('#custom-form').append('<button type="button" id="save-button" onclick="saveFormData()">Save Data</button>');
    }

    // Clear form fields after adding a new field
    clearFormFields();
}


function removeField(fieldId) {
    $('#' + fieldId).parent().remove();
    fields = fields.filter(field => field.id !== fieldId);
}

function saveFormData() {
    // Extract unique field names
    var uniqueFieldNames = Array.from(new Set(fields.map(field => field.name)));

    // Check if headers already exist
    if ($('#table-headers th').length === 0) {
        // Create headers only if they don't exist
        uniqueFieldNames.forEach(fieldName => {
            $('#table-headers').append('<th>' + fieldName + '</th>');
        });
    }

    var newRow = '<tr>';
    uniqueFieldNames.forEach(fieldName => {
        var field = fields.find(f => f.name === fieldName);
        var value = (field.type === 'select') ? $('#' + field.id).val() : $('#' + field.id).val();
        newRow += '<td>' + value + '</td>';
    });
    newRow += '<td><button type="button" onclick="removeRow(this)">Remove</button></td>';
    newRow += '</tr>';

    $('#table-body').append(newRow);

    // Clear form fields after saving data
    clearFormFields();
}
function removeRow(button) {
    $(button).closest('tr').remove();
    
    // If all rows are removed, clear headers 
    if ($('#table-body tr').length === 0) {
        $('#table-headers').empty();
    }
}
