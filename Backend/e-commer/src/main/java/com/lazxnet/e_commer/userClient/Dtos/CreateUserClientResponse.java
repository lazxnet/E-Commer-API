package com.lazxnet.e_commer.userClient.Dtos;

import java.util.UUID;

import lombok.Data;

@Data
public class CreateUserClientResponse {

    private UUID userClientId;
    private String email;
    private String fullNameClient;
    private String password;
    
}
