package com.lazxnet.e_commer.order.service;

import com.lazxnet.e_commer.cart.Entitys.Cart;
import com.lazxnet.e_commer.cart.Entitys.CartItem;
import com.lazxnet.e_commer.cart.Repository.CartRepository;
import com.lazxnet.e_commer.order.Dto.CreateOrderRequest;
import com.lazxnet.e_commer.order.Dto.OrderItemResponse;
import com.lazxnet.e_commer.order.Dto.OrderResponse;
import com.lazxnet.e_commer.order.Entitys.Order;
import com.lazxnet.e_commer.order.Entitys.OrderItem;
import com.lazxnet.e_commer.order.Repository.OrderRepository;
import com.lazxnet.e_commer.products.Entity.Product;
import com.lazxnet.e_commer.products.dto.ImageProductResponse;
import com.lazxnet.e_commer.products.dto.ProductClientResponse;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;
import com.lazxnet.e_commer.userClient.Repository.UserClientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Slf4j
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserClientRepository userClientRepository;
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserClientRepository userClientRepository, CartRepository cartRepository){
        this.orderRepository = orderRepository;
        this.userClientRepository = userClientRepository;
        this.cartRepository = cartRepository;
    }

    public OrderResponse createOrder(CreateOrderRequest request){

        UserClient user = userClientRepository.findById(request.getUserClientId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Cart cart = cartRepository.findByUserClient(user)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        if (cart.getItems().isEmpty()){
            throw new RuntimeException("El carrito está vacio");
        }

        Order order = new Order();
        order.setUserClient(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);

        for (CartItem cartItem : cart.getItems()){
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());

            order.getItems().add(orderItem);

            BigDecimal itemTotal = cartItem.getProduct().getPrice()
            .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            
            order.setTotalAmount(order.getTotalAmount().add(itemTotal));
        }

        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return mapOrderToResponse(savedOrder);
    }

    private OrderResponse mapOrderToResponse(Order order){
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setUserClientId(order.getUserClient().getUserClientId());
        response.setOrderDate(order.getOrderDate());
        response.setStatus(order.getStatus());
        response.setTotalAmount(order.getTotalAmount());

        response.setItems(order.getItems().stream()
                .map(this::mapOrderItemToResponse)
                .collect(Collectors.toList()));
        
        return  response;
    }

    private OrderItemResponse mapOrderItemToResponse(OrderItem item){
        OrderItemResponse response = new OrderItemResponse();
        response.setOrderItemId(item.getOrderItemId());
        response.setQuantity(item.getQuantity());
        response.setPriceAtPurchase(item.getPriceAtPurchase());

        response.setProduct(mapProductToResponse(item.getProduct()));

        return response;
    }

    private ProductClientResponse mapProductToResponse(Product product) {
        ProductClientResponse productClientResponse = new ProductClientResponse();
        productClientResponse.setName(product.getName());
        productClientResponse.setDescription(product.getDescription());
        productClientResponse.setPrice(product.getPrice());
        
        ImageProductResponse imageResponse = new ImageProductResponse();
        imageResponse.setImageBase64(product.getImageProduct().getImageBase64());
        productClientResponse.setImageProduct(imageResponse);
        
        return productClientResponse;
    }
}
