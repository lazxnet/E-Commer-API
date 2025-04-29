package com.lazxnet.e_commer.cart.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lazxnet.e_commer.cart.Dto.AddProductRequest;
import com.lazxnet.e_commer.cart.Dto.CartItemResponse;
import com.lazxnet.e_commer.cart.Dto.CartResponse;
import com.lazxnet.e_commer.cart.Entitys.Cart;
import com.lazxnet.e_commer.cart.Entitys.CartItem;
import com.lazxnet.e_commer.cart.Repository.CartRepository;
import com.lazxnet.e_commer.products.Entity.Product;
import com.lazxnet.e_commer.products.Repository.ProductRepository;
import com.lazxnet.e_commer.products.dto.ImageProductResponse;
import com.lazxnet.e_commer.products.dto.ProductClientResponse;
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
    public CartResponse getCartByUserId(UUID userClientId) {
        UserClient user = userClientRepository.findById(userClientId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
        Cart cart = cartRepository.findByUserClient(user)
            .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));
    
        return mapCartToResponse(cart);
    }

    private CartResponse mapCartToResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setItems(
            cart.getItems().stream().map(this:: mapCartItemToResponse).collect(Collectors.toList())
        );
        return response;
    }
    
    private CartItemResponse mapCartItemToResponse(CartItem item) {
        CartItemResponse itemResponse = new CartItemResponse();
        itemResponse.setItemId(item.getItemId());
        itemResponse.setProduct(mapProductToResponse(item.getProduct()));
        itemResponse.setQuantity(item.getQuantity());
        return itemResponse;
    }
    
    private ProductClientResponse mapProductToResponse(Product product) {
        ProductClientResponse productClientResponse = new ProductClientResponse();
        productClientResponse.setName(product.getName());
        productClientResponse.setDescription(product.getDescription());
        productClientResponse.setPrice(product.getPrice());
        
        // Asumiendo que Product tiene una relación con ImageProduct
        ImageProductResponse imageResponse = new ImageProductResponse();
        imageResponse.setImageBase64(product.getImageProduct().getImageBase64());
        productClientResponse.setImageProduct(imageResponse);
        
        return productClientResponse;
    }

    @Transactional
    public CartResponse addProductToCart(UUID userClientId, AddProductRequest request){
        
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
            throw new IllegalArgumentException("El producto ya está en el carrito"); // <-- Nuevo error
        }
    
        CartItem newItem = new CartItem();
        newItem.setCart(cart);
        newItem.setProduct(product);
        newItem.setQuantity(request.getQuantity());
        cart.getItems().add(newItem);
    
        Cart savedCart = cartRepository.save(cart);
        return mapCartToResponse(savedCart);
    }

    public CartResponse removeItemFromCart(UUID userClientId, UUID itemId){
        UserClient user = userClientRepository.findById(userClientId)
        .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));
        Cart cart = cartRepository.findByUserClient(user)
        .orElseThrow(()-> new RuntimeException("Carrito no encontrado"));

        boolean removed = cart.getItems().removeIf(
            item -> item.getItemId().equals(itemId)
        );
        if (!removed) {
            throw new RuntimeException("El item no existe en el carrito");
        }
        
        Cart saveCart = cartRepository.save(cart);
        return mapCartToResponse(saveCart);
    }
}
