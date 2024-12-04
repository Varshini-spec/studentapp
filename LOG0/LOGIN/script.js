document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const signUpForm = document.querySelector('.sign-up form');
    const signInForm = document.querySelector('.sign-in form');

    // Event listener for register button click
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    // Event listener for login button click
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    // Event listener for sign-up form submission
    signUpForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Get form values
        const name = signUpForm.querySelector('input[type="text"]').value.trim();
        const email = signUpForm.querySelector('input[type="email"]').value.trim();
        const password = signUpForm.querySelector('input[type="password"]').value.trim();

        // Validate inputs
        if (name === '' || email === '' || password === '') {
            alert('Please fill in all fields.');
            return;
        }

        // Check if email already exists in Local Storage
        if (isEmailExists(email)) {
            alert('Email already exists. Please use a different email.');
            return;
        }

        // Save new user to Local Storage
        saveUser(name, email, password);

        // Reset form
        signUpForm.reset();

        // Optionally, inform user about successful registration
        alert('Registration successful! Please log in.');
    });

    // Event listener for sign-in form submission
    signInForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Get form values
        const email = signInForm.querySelector('input[type="email"]').value.trim();
        const password = signInForm.querySelector('input[type="password"]').value.trim();

        // Validate credentials against Local Storage data
        if (validateSignIn(email, password)) {
            alert('Login successful! Redirecting to next page.'); // Placeholder action
            signInForm.reset(); // Reset form after successful login
            // Redirect to index.html in the calendar folder after successful login
            window.location.href = 'calendar/index.html';
        } else {
            alert('Invalid credentials. Please try again.'); // Notify user about invalid credentials
        }
    });

    // Function to check if email exists in Local Storage
    function isEmailExists(email) {
        const users = getUsersFromLocalStorage();
        return users.some(user => user.email === email);
    }

    // Function to save user to Local Storage
    function saveUser(name, email, password) {
        const users = getUsersFromLocalStorage();
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Function to retrieve users from Local Storage
    function getUsersFromLocalStorage() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    // Function to validate sign-in credentials against Local Storage data
    function validateSignIn(email, password) {
        const users = getUsersFromLocalStorage();
        return users.some(user => user.email === email && user.password === password);
    }
});
