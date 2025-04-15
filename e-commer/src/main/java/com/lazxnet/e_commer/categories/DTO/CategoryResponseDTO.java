package com.lazxnet.e_commer.categories.DTO;

import com.lazxnet.e_commer.userAdmin.dto.UserAdminResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.UUID;

@Data
public class CategoryResponseDTO {
    private UUID categoryId;
    private String name;
    private String description;
    private UserAdminResponseDTO userAdmin;
}
