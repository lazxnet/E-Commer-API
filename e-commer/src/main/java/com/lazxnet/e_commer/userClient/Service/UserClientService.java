package com.lazxnet.e_commer.userClient.Service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.lazxnet.e_commer.cart.Entitys.Cart;
import com.lazxnet.e_commer.cart.Repository.CartRepository;
import com.lazxnet.e_commer.userClient.Dtos.CreateUserClientRequest;
import com.lazxnet.e_commer.userClient.Dtos.CreateUserClientResponse;
import com.lazxnet.e_commer.userClient.Dtos.UserClientResponse;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;
import com.lazxnet.e_commer.userClient.Repository.UserClientRepository;

@Service
public class UserClientService {
    
    @Autowired
    private UserClientRepository userClientRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BCryptPasswordEncoder passwordClientEncoder;

    public UserClientService(
        UserClientRepository userClientRepository,
        BCryptPasswordEncoder passwordClientEncoder)
        {
            this.userClientRepository = userClientRepository;
            this.passwordClientEncoder = passwordClientEncoder;
    }

    //Crear un nuevo Cliente
    public CreateUserClientResponse createUserClient(CreateUserClientRequest request) {
        // Verificar si el email existe
        if (userClientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
    
        // Validar contraseña
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }
    
        // Crear y guardar el usuario
        UserClient userClient = new UserClient();
        userClient.setEmail(request.getEmail());
        userClient.setFullNameClient(request.getFullNameClient());
        userClient.setPassword(
            passwordClientEncoder.encode(request.getPassword())
        );
    
        // Crear carrito asociado
        Cart cart = new Cart();
        cart.setUserClient(userClient);
        userClient.setCart(cart);
    
        // Guardar en base de datos
        UserClient savedUser = userClientRepository.save(userClient);
    
        // Mapear a DTO de respuesta
        CreateUserClientResponse response = new CreateUserClientResponse();
        response.setUserClientId(savedUser.getUserClientId());
        response.setEmail(savedUser.getEmail());
        response.setFullNameClient(savedUser.getFullNameClient());
        response.setPassword(savedUser.getPassword());
    
        return response;
    }

    //TODO: Login userClinet
    public UserClient authenticaUserClient(String email, String password){
        UserClient userClient = userClientRepository.findByEmail(email)
        .orElseThrow(()-> new RuntimeException("Cliente no encontrado"));

        if(!passwordClientEncoder.matches(password, userClient.getPassword())){
            throw new RuntimeException("Contraseña incorrecta");
        }
        return userClient;
    }

    //Profile userClient
    public UserClientResponse getClientProfile(UUID userClientId){
        UserClient userClient = userClientRepository.findById(userClientId)
        .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));

        UserClientResponse response = new UserClientResponse();
        response.setEmail(userClient.getEmail());
        response.setFullName(userClient.getFullNameClient());

        return response;
    }
}
