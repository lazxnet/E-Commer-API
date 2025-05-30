package com.lazxnet.e_commer.order.Entitys;

import java.util.UUID;

import javax.persistence.*;
import org.hibernate.annotations.Type;

import com.lazxnet.e_commer.products.Entity.Product;

import lombok.Data;

@Entity
@Data
@Table(name = "order_items")
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Type(type = "uuid-char")
    @Column(name = "order_item_id")
    private UUID orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;
    private Double priceAtPurchase;
}
