package com.lazxnet.e_commer.order.Dto;

import java.util.UUID;

import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class CreateOrderRequest {
    
    @NotNull(message = "userClientId es obligatorio")
    UUID userClientId;
}
