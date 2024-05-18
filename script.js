document.addEventListener('DOMContentLoaded', function() {
    // Function to handle button clicks
    function toggleSection(sectionId) {
        // Hide all sections
        var sections = document.querySelectorAll('.result-section');
        sections.forEach(function(section) {
            section.style.display = 'none';
        });

        // Remove 'active' class from all buttons
        var buttons = document.querySelectorAll('.buttons button');
        buttons.forEach(function(button) {
            button.classList.remove('active');
        });

        // Show the selected section
        document.getElementById(sectionId).style.display = 'block';

        // Add 'active' class to the clicked button
        var clickedButton = document.getElementById(sectionId + 'Btn');
        clickedButton.classList.add('active');
    }

    // Function to show/hide the upload form
    function showUploadForm() {
        var uploadForm = document.getElementById('uploadForm');
        if (uploadForm.style.display === 'none') {
            uploadForm.style.display = 'block';
        } else {
            uploadForm.style.display = 'none';
        }
    }

    // Function to handle file upload
    function uploadFile() {
        // Implement file upload and analysis logic here
        alert('File uploaded and analyzed!');
    }

    // Function to toggle text visibility
    function toggleText(textId) {
        var textElement = document.getElementById(textId);
        textElement.classList.toggle("hidden");
    }

    // Function to handle form submission
    document.getElementById('predictionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Collect form data
        var formData = new FormData(this);
        
        // Convert form data to JSON
        var jsonData = {};
        formData.forEach(function(value, key) {
            jsonData[key] = value;
        });
        
        // Make POST request to Flask app
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Get response text
        })
        .then(html => {
            // Redirect to the predictions page
            document.open();
            document.write(html);
            document.close();
        })
        .catch(error => console.error('Error:', error));
    });

    // Event listeners for button clicks
    document.getElementById('overviewBtn').addEventListener('click', function() {
        toggleSection('overview');
    });

    document.getElementById('detectionMethodsBtn').addEventListener('click', function() {
        toggleSection('detectionMethods');
    });

    document.getElementById('aboutBtn').addEventListener('click', function() {
        toggleSection('about');
    });

    // Function to open a new page
    window.openPage = function(pageUrl) {
        window.location.href = pageUrl;
    };
});
