// auth.controller.js
import * as authService from "../../../../services/authService.js"

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.registerUser(name, email, password);
    req.session.user = user;
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    req.session.user = user;
    res.redirect("/profile");
  } catch (error) {
    console.log("Error, credenciales inválidas", error);
    res.redirect("/error");
  }
};

export const logOutUser = async (req, res) => {
  try {
    await authService.logOutUser(req);
    res.redirect("/login");
  } catch (error) {
    console.error("Error al cerrar la sesión", error);
    res.status(500).send("Error al cerrar la sesión");
  }
};

export const recoveryPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    await authService.recoveryPassword(email, password);
    res.redirect("/login");
  } catch (error) {
    console.error("Error al recuperar contraseña", error);
    res.status(500).send("Error al recuperar contraseña");
  }
};
