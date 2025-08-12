MySQL CRUD API
A Node.js + Express backend connected to MySQL (hosted on Aiven) for performing CRUD operations.
Includes sample Postman collection for quick testing.

🚀 Features
Create, Read, Update, and Delete operations.
MySQL database hosted on Aiven.
API endpoints ready for integration.
Postman collection included for testing.

clone the repository

npm install

3️⃣ Create .env File
DB_HOST=your-aiven-host
DB_PORT=your-aiven-port
DB_USER=your-aiven-user
DB_PASSWORD=your-aiven-password
DB_NAME=your-database-name


run the server using npm run dev

📮 API Endpoints
Method	Endpoint	Description
GET	/users	Get all users
GET	/users/:id	Get user by ID
POST	/users	Create a new user
PUT	/users/:id	Update user by ID
DELETE	/users/:id	Delete user by ID


