package com.lazxnet.e_commer.userClient.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lazxnet.e_commer.userClient.Dtos.CreateUserClientRequest;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;
import com.lazxnet.e_commer.userClient.Service.UserClientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "UserClient")

@RestController
@RequestMapping("/userclient")
public class UserClientController {
    
    @Autowired
    private UserClientService userClientService;

    //Crear un nuevo cliente
    @Operation(
            summary = "Crear Usuario",
            description = "Endpoint para crear un nuevo Usuario"
    )
    @PostMapping("/createUser") 
    public ResponseEntity<UserClient> createClientUser(@RequestBody CreateUserClientRequest request){
        UserClient newClient = userClientService.createUserClient(request);
        return new ResponseEntity<>(newClient, HttpStatus.CREATED);
    }
}
