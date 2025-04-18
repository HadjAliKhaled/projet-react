// src/components/NewProjectForm.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const NewProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() !== '') {
      try {
        await addDoc(collection(db, 'projects'), {
          name: title,
          description: description || '',
          dueDate: dueDate || null,
          createdAt: Timestamp.now(),
        });
        // Après création, rediriger vers l'écran d'accueil (ou vers le détail du projet, selon votre choix)
        navigate('/');
      } catch (error) {
        console.error("Erreur lors de l'ajout du projet :", error);
      }
    }
  };

  return (
    <div className="new-project-form">
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
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
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-dark">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectForm;
