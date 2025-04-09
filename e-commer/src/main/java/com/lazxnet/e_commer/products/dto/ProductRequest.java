package com.lazxnet.e_commer.products.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ProductRequest {
    private String name;
    private String imageBase64;
    private String description;
    private BigDecimal price;
    private UUID categoryId;
}
