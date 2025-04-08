package com.lazxnet.e_commer.categories.Entity;



import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.UUID;

@Data
@Entity
public class Category {

    @Id
    @Schema(hidden = true)
    @GeneratedValue(generator = "UUID")
    @Type(type = "uuid-char")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "category_id")
    private UUID category_id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;
}
