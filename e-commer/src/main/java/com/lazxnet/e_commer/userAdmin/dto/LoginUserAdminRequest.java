package com.lazxnet.e_commer.userAdmin.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginUserAdminRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
