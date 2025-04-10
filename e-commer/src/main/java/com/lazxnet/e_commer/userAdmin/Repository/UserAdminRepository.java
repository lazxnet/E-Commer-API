package com.lazxnet.e_commer.userAdmin.Repository;

import com.lazxnet.e_commer.userAdmin.Entity.UserAdmin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserAdminRepository extends JpaRepository<UserAdmin, UUID> {
    Optional<UserAdmin> findByEmail(String email);
}
