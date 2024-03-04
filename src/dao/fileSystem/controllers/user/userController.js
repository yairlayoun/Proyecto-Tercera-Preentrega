// controllers/userController.js
import UserDto from '../dto/user.dto.js';
import userRepository from '../dao/repositories/userRepository.js';

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.getUserByEmail(email);
    if (user) {
      const userDto = new UserDto(user._id, user.email, user.first_name);
      req.session.user = userDto; 
      res.json({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión', message: error.message });
  }
};

export const showProfile = (req, res) => {
  try {
    const userDto = req.session.user;

    if (!userDto) {
      // Si el usuario no está autenticado, redirige al login u otra acción
      return res.redirect('/login');
    }

    res.render('index', { user: userDto });
  } catch (error) {
    console.error("Error en showProfile controller", error);
    res.status(500).json({ error: 'Error al mostrar el perfil', message: error.message });
  }
};
