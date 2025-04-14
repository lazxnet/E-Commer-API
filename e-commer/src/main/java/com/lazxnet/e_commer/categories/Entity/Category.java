package com.lazxnet.e_commer.categories.Entity;



import com.lazxnet.e_commer.userAdmin.Entity.UserAdmin;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
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
    private UUID categoryId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_admin_id",
            referencedColumnName = "user_admin_id",
            nullable = false)
    private UserAdmin userAdmin;
}
