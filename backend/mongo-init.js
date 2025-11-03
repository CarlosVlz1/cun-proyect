// Script de inicialización de MongoDB
db = db.getSiblingDB('tareas_db');

// Crear colecciones
db.createCollection('users');
db.createCollection('tasks');
db.createCollection('categories');

// Crear índices para usuarios
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Crear índices para tareas
db.tasks.createIndex({ user: 1 });
db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ priority: 1 });
db.tasks.createIndex({ dueDate: 1 });
db.tasks.createIndex({ title: 'text', description: 'text' });
db.tasks.createIndex({ user: 1, status: 1, priority: 1 });

// Crear índices para categorías
db.categories.createIndex({ user: 1 });
db.categories.createIndex({ name: 1, user: 1 }, { unique: true });

print('MongoDB inicializado correctamente');

