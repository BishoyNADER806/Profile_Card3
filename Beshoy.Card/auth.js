// Supabase Initialization
const supabaseUrl = 'https://xtlvfxzgkmqdiassieii.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bHZmeHpna21xZGlhc3NpZWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDU4NzcsImV4cCI6MjA2MzU4MTg3N30.xygcIGRpg4IPEZBkpcPZbLT1HP6qnpO_p8uDigxgpEE'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// Image Preview
function previewImage(input) {
    const preview = document.getElementById('imagePreview')
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = function(e) {
            preview.src = e.target.result
            preview.style.display = 'block'
        }
        reader.readAsDataURL(input.files[0])
    }
}

// Toggle Loading Message
function toggleLoading(show) {
    const loadingMessage = document.getElementById('loadingMessage')
    if (loadingMessage) {
        loadingMessage.style.display = show ? 'block' : 'none'
    }
}

// Show Error Message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage')
    if (errorMessage) {
        errorMessage.textContent = message
        errorMessage.style.display = 'block'
    }
}

// Handle Signup Form Submission
async function handleSignup(event) {
    event.preventDefault()
    
    // Get form values
    const fullName = document.getElementById('fullName').value
    const city = document.getElementById('city').value
    const job = document.getElementById('job').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const profileImage = document.getElementById('profileImage').files[0]

    // Convert image to base64
    let imageBase64 = null
    if (profileImage) {
        const reader = new FileReader()
        imageBase64 = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result)
            reader.readAsDataURL(profileImage)
        })
    }

    // Create user data object
    const userData = {
        full_name: fullName,
        city: city,
        job: job,
        email: email,
        password: password,
        avatar_url: imageBase64
    }

    // Save to localStorage
    try {
        // Get existing users or create new array
        const existingUsers = JSON.parse(localStorage.getItem('users')) || []
        
        // Check if email already exists
        const emailExists = existingUsers.some(user => user.email === email)
        if (emailExists) {
            alert('هذا البريد الإلكتروني مسجل بالفعل')
            return
        }

        // Add new user
        existingUsers.push(userData)
        
        // Save updated users array
        localStorage.setItem('users', JSON.stringify(existingUsers))
        // Save current user
        localStorage.setItem('currentUser', JSON.stringify(userData))
        
        console.log('Data saved successfully:', userData)
        
        // Redirect to profile page
        window.location.href = 'profile.html'
    } catch (error) {
        console.error('Error saving data:', error)
        alert('حدث خطأ أثناء حفظ البيانات')
    }
}

// Handle Login Form Submission
async function handleLogin(event) {
    event.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    console.log('Login attempt with:', { email, password })

    try {
        // Get all users
        const users = JSON.parse(localStorage.getItem('users')) || []
        console.log('All users:', users)

        // Find user with matching email and password
        const user = users.find(u => u.email === email && u.password === password)

        if (user) {
            console.log('Login successful')
            // Save current user data
            localStorage.setItem('currentUser', JSON.stringify(user))
            window.location.href = 'profile.html'
        } else {
            console.log('Invalid credentials')
            alert('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        }
    } catch (error) {
        console.error('Error during login:', error)
        alert('حدث خطأ أثناء تسجيل الدخول')
    }
}

// Load Profile Data
async function loadProfileData() {
    try {
        console.log('Loading profile data')
        // Get current user data
        const userData = JSON.parse(localStorage.getItem('currentUser'))
        console.log('Loaded user data:', userData)

        if (userData) {
            // Update profile elements
            const profileName = document.getElementById('profileName')
            const profileCity = document.getElementById('profileCity')
            const profileJob = document.getElementById('profileJob')
            const profileImage = document.getElementById('profileImage')

            if (profileName) profileName.textContent = userData.full_name
            if (profileCity) profileCity.textContent = userData.city
            if (profileJob) profileJob.textContent = userData.job
            if (profileImage && userData.avatar_url) {
                profileImage.src = userData.avatar_url
            }
        }

        // Add logout functionality
        const logoutButton = document.getElementById('logoutButton')
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                // Clear current user data only
                localStorage.removeItem('currentUser')
                window.location.href = 'index.html'
            })
        }
    } catch (error) {
        console.error('Error loading profile:', error)
    }
}

// Check Authentication Status
async function checkAuth() {
    // Load profile data directly without any checks
    if (window.location.pathname.includes('profile.html')) {
        loadProfileData()
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', checkAuth) 