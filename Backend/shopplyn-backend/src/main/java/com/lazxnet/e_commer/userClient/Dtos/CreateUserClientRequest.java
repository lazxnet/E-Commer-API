package com.lazxnet.e_commer.userClient.Dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CreateUserClientRequest {
    
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String fullNameClient;

    @NotBlank
    private String password;
}
