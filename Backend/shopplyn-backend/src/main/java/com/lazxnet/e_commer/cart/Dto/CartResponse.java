package com.lazxnet.e_commer.cart.Dto;

import java.util.List;
import lombok.Data;

@Data
public class CartResponse {
    private List<CartItemResponse> items;
}