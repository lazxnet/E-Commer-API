package com.lazxnet.e_commer.products.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UserAdminResponse {

    private UUID userAdminId;

    private String fullName;

    private String email;
}
