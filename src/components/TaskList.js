// src/components/TaskList.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

const TaskList = () => {
  const { id } = useParams();
  console.log("Received project ID:", id);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Récupération du projet et de ses tâches en temps réel
  useEffect(() => {
    const projectDoc = doc(db, 'projects', id);
    const unsubscribeProject = onSnapshot(projectDoc, snapshot => {
      if (snapshot.exists()) {
        console.log("Project Data:", snapshot.data());
        setProject({ id: snapshot.id, ...snapshot.data() });
      } else {
        console.error("No such project!");
        setProject(null);
      }
    });

    const tasksCollection = collection(db, 'projects', id, 'tasks');
    const unsubscribeTasks = onSnapshot(tasksCollection, snapshot => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Tasks Data:", tasksData);
      setTasks(tasksData);
    });

    return () => {
      unsubscribeProject();
      unsubscribeTasks();
    };
  }, [id]);

  // Ajouter une nouvelle tâche
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      try {
        await addDoc(collection(db, 'projects', id, 'tasks'), {
          name: newTask,
          completed: false
        });
        setNewTask('');
      } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche :", error);
      }
    }
  };

  // Supprimer une tâche
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'projects', id, 'tasks', taskId));
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  };

  // Basculement de l’état complété d’une tâche
  const toggleTaskCompletion = async (task) => {
    try {
      await updateDoc(doc(db, 'projects', id, 'tasks', task.id), {
        completed: !task.completed
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  // Supprimer tout le projet
  const handleDeleteProject = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        navigate('/');
      } catch (error) {
        console.error("Erreur lors de la suppression du projet :", error);
      }
    }
  };

  if (project === null) {
    return (
      <div className="task-list">
        <p>Projet introuvable ou supprimé.</p>
        <Link to="/" className="btn btn-secondary">Retour aux projets</Link>
      </div>
    );
  }

  // Si le projet n’a pas encore été chargé, on peut afficher un message de chargement
  if (!project) {
    return <div>Chargement...</div>;
  }

  // Format d’affichage de la date si elle existe
  const formattedDate = project.dueDate 
    ? new Date(project.dueDate).toLocaleDateString('en-CA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null;

  return (
    <div className="task-list">
      <div className="task-list-header d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2>{project.name}</h2>
          {formattedDate && <small>{formattedDate}</small>}
          {project.description && <p>{project.description}</p>}
        </div>
        <button 
          className="btn btn-danger" 
          onClick={handleDeleteProject}
        >
          Delete
        </button>
      </div>

      <h4>Tasks</h4>
      <form onSubmit={handleAddTask} className="d-flex gap-2 mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Add a task" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit" className="btn btn-dark">Add</button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <ul className="list-group">
          {tasks.map(task => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleTaskCompletion(task)} 
                  className="me-2"
                />
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.name}
                </span>
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteTask(task.id)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <Link to="/" className="btn btn-secondary">Retour aux projets</Link>
      </div>
    </div>
  );
};

export default TaskList;
