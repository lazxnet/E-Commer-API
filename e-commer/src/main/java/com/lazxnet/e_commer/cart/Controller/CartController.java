package com.lazxnet.e_commer.cart.Controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lazxnet.e_commer.cart.Entitys.Cart;
import com.lazxnet.e_commer.cart.Service.CartService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Cart")

@RestController
@RequestMapping("/cart")
public class CartController {
    
    @Autowired
    private CartService cartService;

    public CartController(CartService cartService){
        this.cartService = cartService;
    }

    @GetMapping("/getcart/{userClientId}")
    public ResponseEntity<Cart>getCartByUserClientId(@PathVariable UUID userClientId){
        Cart cart = cartService.getCartByUserId(userClientId);
        return ResponseEntity.ok(cart);
    }
}
