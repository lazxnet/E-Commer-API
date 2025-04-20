package com.lazxnet.e_commer.userClient.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.lazxnet.e_commer.userClient.Dtos.CreateUserClientRequest;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;
import com.lazxnet.e_commer.userClient.Repository.UserClientRepository;

@Service
public class UserClientService {
    
    @Autowired
    private UserClientRepository userClientRepository;

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
    public UserClient createUserClient(CreateUserClientRequest request){
        //Verificar q el email existe
        if(userClientRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("El email ya esta registrado");
        }

        //Crear y guardar el usuario
        UserClient userClient = new UserClient();
        userClient.setEmail(request.getEmail());
        userClient.setFullNameClient(request.getFullNameCient());
        userClient.setPassword(
            //Encriptar contraseña
            passwordClientEncoder.encode(
                request.getPassword()
            )
        );
        return userClientRepository.save(userClient);
    }
}
