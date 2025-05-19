package com.lazxnet.e_commer.userClient.Dtos;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class LoginUserClientRequest {
    
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
