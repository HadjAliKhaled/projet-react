// src/components/ProjectList.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { Link, useLocation } from 'react-router-dom';
import { collection, addDoc, onSnapshot, deleteDoc, doc, Timestamp } from "firebase/firestore";

const ProjectList = () => {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Champs du formulaire de création
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Vérifie si le state de navigation demande l'ouverture du formulaire
  useEffect(() => {
    if (location.state && location.state.openForm) {
      setShowForm(true);
    }
  }, [location]);

  // Récupération en temps réel de la collection "projects"
  useEffect(() => {
    const projectsRef = collection(db, 'projects');
    const unsubscribe = onSnapshot(projectsRef, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
    });
    return () => unsubscribe();
  }, []);

  // Création d'un nouveau projet
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (title.trim() !== '') {
      try {
        await addDoc(collection(db, 'projects'), {
          name: title,
          description: description || '',
          dueDate: dueDate || null,
          createdAt: Timestamp.now(),
        });
        // Réinitialiser le formulaire et fermer celui-ci
        setTitle('');
        setDescription('');
        setDueDate('');
        setShowForm(false);
      } catch (error) {
        console.error("Erreur lors de l'ajout du projet : ", error);
      }
    }
  };

  // Suppression d'un projet
  const handleDeleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error("Erreur lors de la suppression du projet : ", error);
    }
  };

  return (
    <div className="project-list">
      {/* Bouton pour afficher/masquer le formulaire */}
      <button 
        onClick={() => setShowForm(!showForm)} 
        className="btn add-project-btn"
      >
        + Add Project
      </button>

      {showForm && (
        <form onSubmit={handleAddProject} className="project-form my-3">
          <div className="form-group mb-2">
            <label htmlFor="title">TITLE</label>
            <input
              id="title"
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="description">DESCRIPTION</label>
            <textarea
              id="description"
              className="form-control"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="dueDate">DUE DATE</label>
            <input
              id="dueDate"
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2 mt-2">
            <button 
              type="button" 
              className="btn btn-light" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-dark">
              Save
            </button>
          </div>
        </form>
      )}

      <ul className="list-group mt-4">
        {projects.map(project => (
          <li 
            key={project.id} 
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <Link to={`/project/${project.id}`}>{project.name}</Link>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteProject(project.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
