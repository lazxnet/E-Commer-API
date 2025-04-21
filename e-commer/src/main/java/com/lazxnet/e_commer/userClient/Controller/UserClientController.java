package com.lazxnet.e_commer.userClient.Controller;

import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lazxnet.e_commer.userClient.Dtos.CreateUserClientRequest;
import com.lazxnet.e_commer.userClient.Dtos.LoginUserClientRequest;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;
import com.lazxnet.e_commer.userClient.Service.UserClientService;

import io.swagger.v3.oas.annotations.Operation;
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
    public ResponseEntity<UserClient> createClientUser(@Valid @RequestBody CreateUserClientRequest request){
        System.out.println("Request recibido: " + request);
        UserClient newClient = userClientService.createUserClient(request);
        return new ResponseEntity<>(newClient, HttpStatus.CREATED);
    }

    //TODO: Login de usuario
    @Operation(
            summary = "Logiar Usuario",
            description = "Endpoint para logiar Usuario"
    )
    @PostMapping("/loginUserClient")
    public ResponseEntity<?> loginUserClient(@RequestBody LoginUserClientRequest loginUserClientRequest){
        try{
            UserClient authenticatedUserClient = userClientService.authenticaUserClient(
                loginUserClientRequest.getEmail(), 
                loginUserClientRequest.getPassword()
                );

             Map<String, Object> response = new HashMap<>();
             response.put("message", "Login exitoso");
             response.put("userClientId", authenticatedUserClient.getUserClientId());
             
             return ResponseEntity.ok(response);

        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
