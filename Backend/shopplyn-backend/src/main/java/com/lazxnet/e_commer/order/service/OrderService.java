package com.lazxnet.e_commer.order.service;

import com.lazxnet.e_commer.cart.Entitys.Cart;
import com.lazxnet.e_commer.cart.Entitys.CartItem;
import com.lazxnet.e_commer.cart.Repository.CartRepository;
import com.lazxnet.e_commer.order.Dto.CreateOrderRequest;
import com.lazxnet.e_commer.order.Dto.OrderResponse;
import com.lazxnet.e_commer.order.Entitys.Order;
import com.lazxnet.e_commer.order.Entitys.OrderItem;
import com.lazxnet.e_commer.order.Repository.OrderRepository;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;
import com.lazxnet.e_commer.userClient.Repository.UserClientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        UserClient user = userClientRepository.findById(request.userClientId())
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
        order.setTotalAmount(0.0);

        for (CartItem cartItem : cart.getItems()){
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());

            order.getItems().add(orderItem);
            order.setTotalAmount(order.getTotalAmount() +
                    (cartItem.getProduct().getPrice() *
                            cartItem.getQuantity()));
        }

        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);


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
}
