package com.lazxnet.e_commer.products.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ProductClientResponse {
    private ImageProductResponse imageProduct;
    private String name;
    private String description;
    private BigDecimal price;
}
