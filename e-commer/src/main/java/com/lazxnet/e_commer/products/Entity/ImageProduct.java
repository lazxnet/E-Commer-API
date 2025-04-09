package com.lazxnet.e_commer.products.Entity;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Data
@Entity
@Table(name = "image_product")
public class ImageProduct {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Type(type = "uuid-char")
    private UUID imageProductId;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String imageBase64;

}
