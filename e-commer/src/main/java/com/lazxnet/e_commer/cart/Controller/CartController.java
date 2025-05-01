package com.lazxnet.e_commer.cart.Controller;

import java.util.UUID;

import javax.validation.Valid;

import com.lazxnet.e_commer.cart.Dto.UpdateQuantityRequest;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Operation(
            summary = "Obtener carrito de un usuario",
            description = "Endpoint para obtener carrito de un usuario"
    )
    @GetMapping("/getcart/{userClientId}")
    public ResponseEntity<CartResponse> getCartByUserClientId(@PathVariable UUID userClientId) {
        CartResponse cartResponse = cartService.getCartByUserId(userClientId);
        return ResponseEntity.ok(cartResponse);
    }

    @Operation(
            summary = "Agregar producto al carrito",
            description = "Endpoint para agregar producto al carrito"
    )
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

    @Operation(
            summary = "Eliminar producto del carrito",
            description = "Endpoint para eliminar producto del carrito"
    )
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

    @Operation(
            summary = "Editar la cantidad a comprar de un producto",
            description = "Endpoint para editar la cantidad a comprar de un producto"
    )
    @PutMapping("/{userClientId}/update-item/{itemId}")
    public ResponseEntity<?> updateItemQuantity(@PathVariable UUID userClientId,
                                                @PathVariable UUID itemId,
                                                @Valid @RequestBody UpdateQuantityRequest request
    ){
        try {
            CartResponse cartResponse = cartService.updateItemQuantity(userClientId, itemId, request);
            return ResponseEntity.ok(cartResponse);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
