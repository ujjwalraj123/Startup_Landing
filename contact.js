document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);
    addValidationListeners();
    addPhoneNumberRestriction();
    handleFileUpload();
});

function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;

    clearErrors(form);

    // Validate all fields with specific class selectors
    isValid &= validateField(form, '.full-name', 'Full name is required');
    isValid &= validateEmail(form);
    isValid &= validatePhone(form);
    isValid &= validateField(form, '.dob-input', 'Date of birth is required');
    isValid &= validateField(form, '.gender-input', 'Gender is required');
    isValid &= validateField(form, '.city-input', 'City is required');
    isValid &= validateField(form, '.state-input', 'State is required');
    isValid &= validateField(form, '.country-input', 'Country is required');
    isValid &= validateField(form, '.address-input', 'Address is required');
    isValid &= validateField(form, '.message-input', 'Message is required');
    isValid &= validateRadio(form);
    isValid &= validateCheckbox(form);
    isValid &= validateFile(form);

    if (isValid) {
        simulateSubmission()
            .then(() => {
                showSuccessPopup();
                form.reset();
                resetFileUpload();
            })
            .catch(error => {
                showErrorMessage(form, error);
            });
    }
}


function validateField(form, selector, message) {
    const field = form.querySelector(selector);
    if (!field) return true;
    if (field.value.trim() === '') {
        showError(field, message);
        return false;
    }
    return true;
}

function validateEmail(form) {
    const email = form.querySelector('input[type="email"]');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.value.trim())) {
        showError(email, 'Valid email is required');
        return false;
    }
    return true;
}

function validatePhone(form) {
    const phone = form.querySelector('input[type="tel"]');
    const re = /^\d{10}$/;
    if (!re.test(phone.value.trim())) {
        showError(phone, 'Phone number must be 10 digits');
        return false;
    }
    return true;
}

function validateRadio(form) {
    const radios = form.querySelectorAll('input[name="counseling"]');
    const isSelected = Array.from(radios).some(radio => radio.checked);
    if (!isSelected) {
        const container = radios[0].closest('div');
        showError(container, 'Please select an option');
        return false;
    }
    return true;
}

function validateCheckbox(form) {
    const checkbox = form.querySelector('input[type="checkbox"]');
    if (!checkbox.checked) {
        const container = checkbox.closest('div');
        showError(container, 'You must agree to the terms');
        return false;
    }
    return true;
}

function validateFile(form) {
    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput.files.length === 0) {
        const container = fileInput.closest('div');
        showError(container, 'Please upload your CV/Resume');
        return false;
    }
    return true;
}

function showError(element, message) {
    const error = document.createElement('div');
    error.className = 'error-message text-red-500 text-sm mt-1';
    error.textContent = message;
    element.parentElement.appendChild(error);
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.classList.add('border-red-500');
    }
}

function clearErrors(form) {
    form.querySelectorAll('.error-message').forEach(error => error.remove());
    form.querySelectorAll('input, textarea').forEach(input => {
        input.classList.remove('border-red-500');
    });
}

function addValidationListeners() {
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('border-red-500');
            const error = this.parentElement.querySelector('.error-message');
            if (error) error.remove();
        });
    });

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const container = this.closest('div');
            const error = container.querySelector('.error-message');
            if (error) error.remove();
        });
    });

    document.querySelector('input[type="checkbox"]').addEventListener('change', function() {
        const error = this.closest('div').querySelector('.error-message');
        if (error) error.remove();
    });

    document.querySelector('input[type="file"]').addEventListener('change', function() {
        const error = this.closest('div').querySelector('.error-message');
        if (error) error.remove();
    });
}

function addPhoneNumberRestriction() {
    const phoneInput = document.querySelector('input[type="tel"]');
    
    phoneInput.addEventListener('input', function(e) {
        let cleanedValue = this.value.replace(/\D/g, '');
        cleanedValue = cleanedValue.substring(0, 10);
        this.value = cleanedValue;
    });

    phoneInput.addEventListener('paste', function(e) {
        const pasteData = e.clipboardData.getData('text');
        if (/\D/.test(pasteData)) {
            e.preventDefault();
        }
    });
}

function handleFileUpload() {
    const fileInput = document.getElementById('file-upload');
    const fileLabel = document.querySelector('.file-label');
    const fileSuccess = document.querySelector('.file-success');
    const uploadContainer = fileInput.closest('.py-2');

    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            fileLabel.textContent = fileName;
            fileLabel.classList.add('text-green-600');
            fileSuccess.classList.remove('hidden');
            uploadContainer.classList.add('file-uploaded');
            
            const error = uploadContainer.parentElement.querySelector('.error-message');
            if (error) error.remove();
        } else {
            resetFileUpload();
        }
    });
}

function resetFileUpload() {
    const fileLabel = document.querySelector('.file-label');
    const fileSuccess = document.querySelector('.file-success');
    const uploadContainer = document.querySelector('input[type="file"]').closest('.py-2');
    
    fileLabel.textContent = 'Choose file';
    fileLabel.classList.remove('text-green-600');
    fileSuccess.classList.add('hidden');
    uploadContainer.classList.remove('file-uploaded');
}

function simulateSubmission() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            Math.random() < 0.9 ? resolve() : reject('Submission failed. Please try again.');
        }, 1500);
    });
}

function showSuccessPopup() {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="bg-white p-8 rounded-lg text-center animate-fade-in">
            <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h3 class="mt-4 text-xl font-semibold text-gray-900">Success!</h3>
            <p class="mt-2 text-gray-600">Form submitted successfully!</p>
        </div>
    `;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 5000);
}

function showErrorMessage(form, message) {
    const error = document.createElement('div');
    error.className = 'error-feedback bg-red-100 text-red-700 p-4 rounded-lg mt-4 text-center';
    error.textContent = message;
    form.parentElement.insertBefore(error, form.nextSibling);
    
    setTimeout(() => error.remove(), 5000);
}
