// controllers/viewController.js
import { renderProfileView } from '../../../../views/viewView.js';

const profileView = (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      // Si el usuario no está autenticado, redirige al login u otra acción
      return res.redirect('/login');
    }

    const viewData = renderProfileView(user);
    res.render(viewData.view, { user: viewData.user });
  } catch (error) {
    console.error("Error en profileView controller", error);
    res.status(500).json({ error: 'Error al mostrar la vista de perfil', message: error.message });
  }
};

export { profileView };
