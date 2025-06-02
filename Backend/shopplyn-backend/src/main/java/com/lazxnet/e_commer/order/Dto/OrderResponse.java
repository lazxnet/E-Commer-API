package com.lazxnet.e_commer.order.Dto;

import com.lazxnet.e_commer.order.Entitys.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class OrderResponse {
    private UUID orderId;
    private UUID userClientId;
    private LocalDateTime orderDate;
    private Order.OrderStatus status;
    private BigDecimal totalAmount;
    private List<OrderItemResponse> items;
}