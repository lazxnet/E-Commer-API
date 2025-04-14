package com.lazxnet.e_commer.userAdmin.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.UUID;

@Data
public class UserAdminResponseDTO {
    private UUID userAdminId;
    private String email;
    private String fullName;
}
