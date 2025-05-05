package com.lazxnet.e_commer.categories.DTO;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class CategoryRequestDTO {
    @Schema(description = "Nombre de la categoría", example = "Electrónicos")
    private String name;

    @Schema(description = "Descripción de la categoría", example = "Productos electrónicos")
    private String description;
}