package com.lazxnet.e_commer.products.dto;

import com.lazxnet.e_commer.categories.Entity.Category;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class ProductResponse {

    private UUID productId;
    private String name;
    private String description;
    private BigDecimal price;
    private Category category;
}
