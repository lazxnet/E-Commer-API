package com.lazxnet.e_commer.userAdmin.Controller;

import com.lazxnet.e_commer.userAdmin.Entity.UserAdmin;
import com.lazxnet.e_commer.userAdmin.Service.UserAdminService;
import com.lazxnet.e_commer.userAdmin.dto.CreateUserAdminRequest;
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

    @Operation(
            summary = "Crear Usuario Administrador",
            description = "Endpoint para crear un nuevo Usuario Administrador"
    )
    @PostMapping("/createAdminUser")
    public ResponseEntity<UserAdmin> createAdminUser(@RequestBody CreateUserAdminRequest request){
        UserAdmin newUser = userAdminService.createAdminUser(request);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

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
}
