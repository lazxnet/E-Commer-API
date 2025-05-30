package com.lazxnet.e_commer.products.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ProductResponse {

    private UUID productId;
    private String imageBase64;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private CategoryResponseForProduct category;
    private UserAdminResponse userAdmin;
}
