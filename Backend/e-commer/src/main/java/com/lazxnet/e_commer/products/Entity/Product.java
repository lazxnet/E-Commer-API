package com.lazxnet.e_commer.products.Entity;

import com.lazxnet.e_commer.cart.Entitys.CartItem;
import com.lazxnet.e_commer.categories.Entity.Category;
import com.lazxnet.e_commer.userAdmin.Entity.UserAdmin;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class Product {

    @Id
    @Schema(hidden = true)
    @GeneratedValue(generator = "UUID")
    @Type(type = "uuid-char")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "product_id")
    private UUID productId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_product_id")
    private ImageProduct imageProduct;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "quantity", nullable = false)
    @Min(value = 1, message = "La cantidad minima es 1")
    private Integer quantity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_admin_id",
            referencedColumnName = "user_admin_id",
            nullable = false,
            foreignKey = @ForeignKey(name="FK_PRODUCT_USER_ADMIN")
            )
    private UserAdmin userAdmin;

    @OneToMany(
        mappedBy = "product", 
        cascade = CascadeType.ALL, 
        orphanRemoval = true
    )
    @Schema(hidden = true)
    private List<CartItem> cartItems = new ArrayList<>();
}
