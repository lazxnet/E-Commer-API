package com.lazxnet.e_commer.order.Dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.lazxnet.e_commer.products.dto.ProductClientResponse;
import lombok.Data;

@Data
public class OrderItemResponse {
    private UUID orderItemId;
    private ProductClientResponse product;
    private int quantity;
    private BigDecimal priceAtPurchase;
}
