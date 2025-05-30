package com.lazxnet.e_commer.order.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lazxnet.e_commer.order.Entitys.Order;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserClient_UserClientId(UUID userClientId);
}
