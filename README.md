# 🏬 Store Ratings Web Application

A full-stack web application built with **React (frontend)** and **NestJS + TypeORM + MySQL (backend)**.  
It allows **Admins, Store Owners, and Normal Users** to log in and interact with stores and ratings.

---

##  Features

###  User Roles

####  System Administrator (Admin)
- Add **new stores**, **users** (Admin, Owner, User).
- Dashboard displays:
  - Total number of users
  - Total number of stores
  - Total number of ratings
- Can filter/search by name, email, role, and address.
- Can view store details with ratings.

####  Normal User
- Sign up and log in.
- View list of all stores with:
  - Store name
  - Address
  - Overall rating
  - Their own submitted rating
- Can **submit or modify ratings** (1–5 stars).
- Can update their password.

####  Store Owner
- Log in and update password.
- Dashboard shows:
  - Their store(s) with **average ratings**.
  - List of users who rated their store.

---

##  Tech Stack

- **Frontend**: React + Vite + TailwindCSS + Axios  
- **Backend**: NestJS + TypeORM  
- **Database**: MySQL  
- **Auth**: JWT (JSON Web Tokens)  
- **Password Security**: bcrypt  

---

##  Installation & Setup

### 1️ Clone the Repository
```bash
git clone <your-repo-url>
cd <your-project-folder>
```

---

### 2️ Backend Setup (NestJS + MySQL)

1. Move into the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure MySQL connection in `app.module.ts` or `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=yourpassword
   DB_NAME=store_ratings
   JWT_SECRET=supersecretkey
   ```

4. Import the provided SQL schema:
   ```bash
   mysql -u root -p < schema.sql
   ```

5. Start the backend:
   ```bash
   npm run start:dev
   ```
   Backend will run on: **http://localhost:3000**

---

### 3️ Frontend Setup (React + Vite)

1. Move into frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the frontend:
   ```bash
   npm run dev
   ```
   Frontend will run on: **http://localhost:5173**

---

##  Demo Login / Signup

You will also get a file called **`Test key.txt`** which contains:

-  Pre-created demo accounts (Admin, Owner, Normal User)  
-  Signup format (if signup is required for a new user)

Example (from Test key.txt):
```
1️ System Administrator (Admin)

Signup Payload

{
  "name": "Administrator Demo User",
  "email": "admin@test.com",
  "address": "Admin Head Office Address",
  "password": "Admin@1234",
  "role": "ADMIN"
}


Login

{
  "email": "admin@test.com",
  "password": "Admin@1234"
}



2️  Store Owner

Signup Payload

{
  "name": "Store Owner Demo User",
  "email": "owner@test.com",
  "address": "Pune Maharashtra",
  "password": "Owner@1234",
  "role": "OWNER"
}


Login

{
  "email": "owner@test.com",
  "password": "Owner@1234"
}




3️  Normal User

Signup Payload

{
  "name": "Normal User Demo Account",
  "email": "user@test.com",
  "address": "Mumbai India",
  "password": "User@1234",
  "role": "USER"
}


Login

{
  "email": "user@test.com",
  "password": "User@1234"
}
```

 If signup is not working for a new user, use the given **signup format** to create one, then login.

---

##  Testing the Application

1. Start **Backend** (`npm run start:dev`)  
2. Start **Frontend** (`npm run dev`)  
3. Open **http://localhost:5173**  
4. Use credentials from `Test key.txt` to log in:  
   - Admin → `/admin`  
   - Owner → `/owner`  
   - User → `/user`  

---

##  Validation Rules

- **Name**: 20–60 chars  
- **Email**: must be valid format  
- **Password**: 8–16 chars, 1 uppercase, 1 special char  
- **Address**: up to 400 chars  

---

##  Project Structure

```
project-root/
│── backend/        # NestJS server
│   ├── src/
│   └── ...
│── frontend/       # React + Vite frontend
│   ├── src/
│   └── ...
│── schema.sql      # MySQL schema + demo data
│── Test key.txt    # Demo login/signup credentials
│── README.md       # Project documentation
```

---

##  Notes
- If ratings show as **N/A**, ensure you have added some ratings as a Normal User.  
- If 403 Forbidden error occurs → check JWT token in `localStorage`.  
- Use Admin Dashboard to create new Users or Stores.  

---

##  Author
- **Developed as a Full Stack Evaluation Task**  
- Built with  using React + NestJS + MySQL
