package com.lazxnet.e_commer.userClient.Entitys;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Email;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import lombok.Data;

@Entity
@Data
@Table(name = "user_client")
public class UserClient{

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Type(type = "uuid-char")
    @Column(name = "user_client_id")
    private UUID userClientId;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, name = "full_name_client")
    private String fullNameClient;

    @Column(nullable = false)
    private String password;

}