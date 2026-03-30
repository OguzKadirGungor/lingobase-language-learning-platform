# Lingobase – English Language Learning & Practice Platform

Lingobase is a full-stack web-based English language learning and practice platform developed as a graduation project. It aims to make language learning more engaging by combining AI-powered conversation practice with gamification features.

---

## 🚀 Features

- User registration and login with JWT authentication  
- English lesson and quiz system  
- AI-powered chatbot for English conversation practice (OpenAI API)  
- Gamification features (points, badges, leaderboard)  
- Admin panel for managing lessons, quizzes, and users  
- RESTful API architecture  
- Responsive web interface  

---

## 🛠️ Tech Stack

### Backend
- Node.js  
- Express.js  
- Sequelize ORM  
- MySQL  
- JWT Authentication  
- OpenAI API  

### Frontend
- Vue.js 3  
- Vite  
- TailwindCSS  
- Axios  

### Tools
- Git & GitHub  
- Postman  

---

## 📁 Project Structure

```bash
backend/
frontend/
database_schema.sql
README.md
```

## ⚙️ Installation
### Requirements
- Node.js 18+
- npm 9+
- MySQL 8+

1. Clone the repository
```bash
git clone https://github.com/OguzKadirGungor/lingobase-language-learning-platform.git
cd lingobase-language-learning-platform
```
3. Configure database

Create a database named:
```bash
lingobase
```
3. Environment variables

Create a .env file inside the backend folder:
```
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_NAME=lingobase
DB_HOST=localhost
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_secret_key
```
4. Install dependencies
Backend
```bash
cd backend
npm install
```
Frontend
```bash
cd ../frontend
npm install
```

6. Run the project
Backend
```
cd backend
npm start
```
Frontend
```
cd frontend
npm run dev
```

Author
Oğuz Kadir Güngör

LinkedIn: https://www.linkedin.com/in/oguzkadirgungor/
GitHub: https://github.com/OguzKadirGungor
