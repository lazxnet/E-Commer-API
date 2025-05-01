package com.lazxnet.e_commer.cart.Dto;

import java.util.UUID;
import com.lazxnet.e_commer.products.dto.ProductClientResponse;
import lombok.Data;

@Data
public class CartItemResponse {
    private UUID itemId;
    private ProductClientResponse product;
    private int quantity;
}
