package com.lazxnet.e_commer.userAdmin.Service;

import com.lazxnet.e_commer.userAdmin.Entity.UserAdmin;
import com.lazxnet.e_commer.userAdmin.Repository.UserAdminRepository;
import com.lazxnet.e_commer.userAdmin.dto.CreateUserAdminRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
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


    //Crear un nueno AdminUser
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

    //Eliminar AdminUser por id
    public void deleteAdminUser(UUID userAdminId){

        UserAdmin userAdmin = userAdminRepository.findById(userAdminId)
                .orElseThrow(()->{
                    log.error("Intentando eliminar el admin no encontrado con el id " + userAdminId);
                    return new RuntimeException("El admin no existe");
                });

        userAdminRepository.deleteById(userAdminId);
        log.info("Admin eliminado exitosamente: {}", userAdmin.getEmail());
    }

    //Login AdminUser
    public boolean authenticateAdminUser(String email, String password){
        UserAdmin userAdmin = userAdminRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("Administrador no encontrado"));

        if (!passwordEncoder.matches(password, userAdmin.getPassword())){
            throw new RuntimeException("Contraseña incorrecta");
        }

        return true;
    }
}
