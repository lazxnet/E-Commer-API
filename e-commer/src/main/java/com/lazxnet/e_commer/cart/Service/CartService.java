package com.lazxnet.e_commer.cart.Service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lazxnet.e_commer.cart.Dto.AddProductRequest;
import com.lazxnet.e_commer.cart.Entitys.Cart;
import com.lazxnet.e_commer.cart.Entitys.CartItem;
import com.lazxnet.e_commer.cart.Repository.CartRepository;
import com.lazxnet.e_commer.products.Entity.Product;
import com.lazxnet.e_commer.products.Repository.ProductRepository;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;
import com.lazxnet.e_commer.userClient.Repository.UserClientRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserClientRepository userClientRepository;

    @Autowired
    private ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
     UserClientRepository userClientRepository){
        this.cartRepository = cartRepository;
        this.userClientRepository = userClientRepository;
    }

    @Transactional(readOnly = true)
    public Cart getCartByUserId(UUID userClientId) {
        // Obtener el usuario
        UserClient user = userClientRepository.findById(userClientId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Obtener el carrito
        return cartRepository.findByUserClient(user)
            .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
    }

    @Transactional
    public Cart addProductToCart(UUID userClientId, AddProductRequest request){
        log.info("Received productId: {}", request.getProductId());
        
        UserClient user = userClientRepository.findById(userClientId)
        .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));
        Cart cart = cartRepository.findByUserClient(user)
        .orElseThrow(()-> new RuntimeException("Carrito no encontrado"));

        if (request.getProductId() == null) {
            throw new IllegalArgumentException("productId no puede ser nulo");
        }

        Product product = productRepository.findById(request.getProductId())
        .orElseThrow(()-> new RuntimeException("Producto no encontrado"));

        //Verificar si el producto ya esta agregado al carrito
        Optional<CartItem> existingItem = cart.getItems().stream()
        .filter(item -> item.getProduct().getProductId().equals(request.getProductId()))
        .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cart.getItems().add(newItem);
        }
        return cartRepository.save(cart);
    }
}
