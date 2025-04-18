// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import NewProjectForm from './components/NewProjectForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function EmptyProjectScreen() {
  return (
    <div className="empty-project-screen">
      <img 
        src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" 
        alt="Project management illustration" 
        className="empty-icon" 
      />
      <p>Select a project or get started with a new one.</p>
      {/* Lien redirigeant vers la route /new */}
      <Link to="/new" className="btn create-project-btn">
        Create New Project
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h2>Your Projects</h2>
          <ProjectList />
        </aside>
        {/* CONTENU CENTRAL */}
        <main className="main-content">
          <Routes>
            {/* Route qui affiche le formulaire de création dans la zone centrale */}
            <Route path="/new" element={<NewProjectForm />} />
            {/* Écran d'accueil vide */}
            <Route path="/" element={<EmptyProjectScreen />} />
            {/* Vue détaillée d'un projet */}
            <Route path="/project/:id" element={<TaskList />} />
            {/* Redirection pour les routes non définies */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
