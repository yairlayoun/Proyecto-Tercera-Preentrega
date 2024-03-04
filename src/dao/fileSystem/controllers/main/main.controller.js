// controllers/main.controller.js
import DaoFactory from '../persistence/dao.factory.js';

class MainController {
  constructor() {
    this.userDao = DaoFactory.createDao('mongo'); // Puedes cambiar 'mongo' por el tipo de DAO que desees
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.userDao.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios', message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await this.userDao.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuario', message: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await this.userDao.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: 'Datos de usuario inválidos', message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updatedUserData = req.body;
      const updatedUser = await this.userDao.updateUser(userId, updatedUserData);
      if (!updatedUser) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json(updatedUser);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar usuario', message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      const result = await this.userDao.deleteUser(userId);
      if (!result) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.status(204).end();
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario', message: error.message });
    }
  }
}

export default MainController;
