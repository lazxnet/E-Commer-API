package com.lazxnet.e_commer.cart.Repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.lazxnet.e_commer.cart.Entitys.Cart;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart>findByUserClient(UserClient userClient);
}