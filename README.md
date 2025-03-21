Full-Stack Authentication System
This project is a basic authentication system built with Node.js, PostgreSQL, and EJS for user registration, login, and profile management. It includes features like password hashing, JWT-based authentication, and Google reCAPTCHA integration.

Setup Instructions
Prerequisites
Install Node.js (v14 or later).

Install PostgreSQL and set up a database.

Obtain Google reCAPTCHA keys from Google reCAPTCHA Admin.

Steps - 
1 Clone the Repository:

git clone <repository_url>
cd <repository_name>

2 Install Dependencies:

npm install

3 Set Up the Database:

Create a database in PostgreSQL.

Run the following for db setup

node setup.js 

4 Configure Environment Variables:

Create a .env file in the root of the project and add the following:

DB_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
RECAPTCHA_SITE_KEY=your_recaptcha_site_key

5 Run the Application:

npx nodemon server.js

6 Access the App:

Open your browser and go to http://localhost:3000.

Project Features
User Registration: Register with validation and password hashing.

User Login: Log in with JWT tokens and reCAPTCHA validation.

Profile Management: View profile details on a protected page.

Logout: End the session and clear tokens.





Testing Features - 

User Registration:

Go to /register and create a new account.

Verify validation and database entry.

User Login:

Go to /login and log in after completing reCAPTCHA.

Verify redirection to /profile.

Profile Route:

Access /profile with a valid JWT.

Redirect to /login if unauthenticated.

Rate Limiting:

Submit incorrect login credentials repeatedly.

Ensure login attempts are blocked after exceeding the limit.

Session Expiry Warning:

Log in and stay on the /profile page.

Wait for the warning and test token refresh functionality.#   f u l l S t a c k A u t h G o o g l e r e c a p t c h a  
 