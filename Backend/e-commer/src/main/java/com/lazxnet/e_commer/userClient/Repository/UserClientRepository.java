package com.lazxnet.e_commer.userClient.Repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lazxnet.e_commer.userClient.Entitys.UserClient;

public interface UserClientRepository extends JpaRepository<UserClient, UUID>{
    Optional<UserClient>findByEmail(String email);
    
}
