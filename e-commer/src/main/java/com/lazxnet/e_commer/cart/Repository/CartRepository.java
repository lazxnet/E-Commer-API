package com.lazxnet.e_commer.cart.Repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.lazxnet.e_commer.cart.Entitys.Cart;

public interface CartRepository extends JpaRepository<Cart, UUID> {
}