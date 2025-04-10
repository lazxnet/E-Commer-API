package com.lazxnet.e_commer.userAdmin.Controller;

import com.lazxnet.e_commer.userAdmin.Entity.UserAdmin;
import com.lazxnet.e_commer.userAdmin.Service.UserAdminService;
import com.lazxnet.e_commer.userAdmin.dto.CreateUserAdminRequest;
import com.lazxnet.e_commer.userAdmin.dto.LoginUserAdminRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Tag(name = "UserAdmin")

@RestController
@RequestMapping("/useradmin")
public class UserAdminController {

    @Autowired
    private UserAdminService userAdminService;

    //Crear UserAdmin
    @Operation(
            summary = "Crear Usuario Administrador",
            description = "Endpoint para crear un nuevo Usuario Administrador"
    )
    @PostMapping("/createAdminUser")
    public ResponseEntity<UserAdmin> createAdminUser(@RequestBody CreateUserAdminRequest request){
        UserAdmin newUser = userAdminService.createAdminUser(request);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    //Eliminar UserAdmin por ID
    @Operation(
            summary = "Eliminar usuario administrador por ID",
            description = "Endpoint para eliminar un Usuario Administrador")
    @DeleteMapping("/deleteAdminUser/{userAdminId}")
    public ResponseEntity<?> deleteAdminUser(@PathVariable UUID userAdminId){

        try{
            userAdminService.deleteAdminUser(userAdminId);
            return ResponseEntity.noContent().build();
        } catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    //Login UserAdmin
    @Operation(
            summary = "Logiar Usuario Administrador",
            description = "Endpoint para logiar Usuario Administrador"
    )
    @PostMapping("/loginAdminUser")
    public ResponseEntity<?> loginUserAdmin(@RequestBody LoginUserAdminRequest loginUserAdminRequest){
        try {
            boolean isAuthenticated = userAdminService.authenticateAdminUser(
                    loginUserAdminRequest.getEmail(),
                    loginUserAdminRequest.getPassword()
            );

            if(isAuthenticated){
                return ResponseEntity.ok().body("Login exitoso");
            }

            return ResponseEntity.badRequest().body("Error al autenticar el usuario");
        } catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
