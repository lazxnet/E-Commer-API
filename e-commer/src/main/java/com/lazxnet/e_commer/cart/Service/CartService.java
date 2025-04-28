package com.lazxnet.e_commer.cart.Service;

import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lazxnet.e_commer.cart.Entitys.Cart;
import com.lazxnet.e_commer.cart.Repository.CartRepository;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;
import com.lazxnet.e_commer.userClient.Repository.UserClientRepository;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserClientRepository userClientRepository;

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
}
