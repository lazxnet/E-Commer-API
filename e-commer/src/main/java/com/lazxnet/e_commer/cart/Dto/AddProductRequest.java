package com.lazxnet.e_commer.cart.Dto;

import java.util.UUID;

import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class AddProductRequest {

    @NotNull(message = "productId tiene q ser obligatorio")
    @JsonProperty("productId")
    private UUID productId;
    
    private int quantity;
}
