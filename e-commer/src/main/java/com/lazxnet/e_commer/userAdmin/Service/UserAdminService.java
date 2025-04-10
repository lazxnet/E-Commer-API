package com.lazxnet.e_commer.userAdmin.Service;

import com.lazxnet.e_commer.userAdmin.Entity.UserAdmin;
import com.lazxnet.e_commer.userAdmin.Repository.UserAdminRepository;
import com.lazxnet.e_commer.userAdmin.dto.CreateUserAdminRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAdminService {

    @Autowired
    private UserAdminRepository userAdminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public UserAdminService(
            UserAdminRepository userAdminRepository,
            BCryptPasswordEncoder passwordEncoder){
        this.userAdminRepository = userAdminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserAdmin createAdminUser(CreateUserAdminRequest request){
        //Verificar si el email ya existe
        if (userAdminRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("El email ya esta registrado");
        }

        //Crear y guardar el usuario
        UserAdmin user = new UserAdmin();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(
                //Encriptar contrasena
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        return userAdminRepository.save(user);
    }
}
