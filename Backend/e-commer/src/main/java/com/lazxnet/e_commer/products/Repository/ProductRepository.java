package com.lazxnet.e_commer.products.Repository;

import com.lazxnet.e_commer.products.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findByCategory_CategoryId(UUID categoryCategoryId);
    boolean existsByName(String name);
}
