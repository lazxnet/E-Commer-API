package com.lazxnet.e_commer.cart.Entitys;

import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.lazxnet.e_commer.products.Entity.Product;

import lombok.Data;

@Entity
@Data
@Table(name = "cart_items")
public class CartItem {
    

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Type(type = "uuid-char")
    @Column(name = "item_id")
    private UUID itemId;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonBackReference
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;
}
