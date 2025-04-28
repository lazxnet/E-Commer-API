package com.lazxnet.e_commer.cart.Entitys;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.lazxnet.e_commer.userClient.Entitys.UserClient;

@Entity
@Data
@Table(name = "carts")
public class Cart {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Type(type = "uuid-char")
    @Column(name = "cart_id")
    private UUID cartId;

    @OneToOne
    @JoinColumn(name = "user_client_id")
    @JsonBackReference
    private UserClient userClient;
}
