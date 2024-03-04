// cartsController.js
import * as cartsService from "../../../../services/cartService.js"
import * as ticketsService from "../../../services/ticketsService.js";

export const getCarts = async (req, res) => {
  try {
    const carts = await cartsService.getCarts();
    res.json(carts);
  } catch (error) {
    console.error("Error en getCarts controller", error);
    res.status(500).json({ error: "Error al obtener carritos", message: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await cartsService.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart);
  } catch (error) {
    console.error("Error en getCartById controller", error);
    res.status(500).json({ error: "Error al obtener el carrito", message: error.message });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await cartsService.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error en createCart controller", error);
    res.status(500).json({ error: "Error al crear el carrito", message: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    const result = await cartsService.addProductToCart(cartId, productId, quantity);
    if (!result) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json({ message: "Producto agregado al carrito exitosamente" });
  } catch (error) {
    console.error("Error en addProductToCart controller", error);
    res.status(500).json({ error: "Error al agregar producto al carrito", message: error.message });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const purchaseResult = await cartsService.purchaseCart(cartId);
    
    if (purchaseResult.success) {
      // Generar el ticket con los datos de la compra
      const ticketData = {
        code: generateUniqueCode(), // Implementa tu lógica para generar un código único
        purchase_datetime: new Date(),
        amount: purchaseResult.totalAmount,
        purchaser: req.session.user.email,
        products: purchaseResult.purchasedProducts,
      };
      
      const ticket = await ticketsService.createTicket(ticketData);

      // Filtrar productos que no pudieron comprarse
      const remainingProducts = purchaseResult.failedProducts.map(product => product.productId);
      await cartsService.updateCartProducts(cartId, remainingProducts);

      res.json({ success: true, ticketId: ticket._id });
    } else {
      res.json({ success: false, failedProducts: purchaseResult.failedProducts });
    }
  } catch (error) {
    console.error(`Error en purchaseCart controller: ${error.message}`);
    res.status(500).json({ error: 'Error al realizar la compra', message: error.message });
  }
};


// Función para generar un código único (usando timestamp y un número aleatorio)
function generateUniqueCode() {
  const timestamp = Date.now().toString(36);
  const randomNum = Math.floor(Math.random() * 1000).toString(36);
  return `${timestamp}-${randomNum}`;
}
