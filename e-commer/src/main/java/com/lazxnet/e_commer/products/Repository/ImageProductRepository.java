package com.lazxnet.e_commer.products.Repository;

import com.lazxnet.e_commer.products.Entity.ImageProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ImageProductRepository extends JpaRepository<ImageProduct, UUID> {
}
