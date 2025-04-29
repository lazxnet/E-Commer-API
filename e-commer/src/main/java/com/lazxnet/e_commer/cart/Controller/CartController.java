package com.lazxnet.e_commer.cart.Controller;

import java.util.UUID;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lazxnet.e_commer.cart.Dto.AddProductRequest;
import com.lazxnet.e_commer.cart.Dto.CartResponse;
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
    public ResponseEntity<CartResponse> getCartByUserClientId(@PathVariable UUID userClientId) {
        CartResponse cartResponse = cartService.getCartByUserId(userClientId);
        return ResponseEntity.ok(cartResponse);
    } 

    @PostMapping("/{userClientId}/add-product")
    public ResponseEntity<?> addProductToCart(
    @PathVariable UUID userClientId,
    @Valid @RequestBody AddProductRequest request
    ) {
        try {
            CartResponse cartResponse = cartService.addProductToCart(userClientId, request);
            return ResponseEntity.ok(cartResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{userClientId}/remove-item/{itemId}")
    public ResponseEntity<?> removeItemFromCart(
        @PathVariable UUID userClientId,
        @PathVariable UUID itemId
    ){
        try{
            CartResponse cartResponse = cartService.removeItemFromCart(userClientId, itemId);
            return ResponseEntity.ok(cartResponse);
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
