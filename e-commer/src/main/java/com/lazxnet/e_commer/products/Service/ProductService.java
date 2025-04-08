package com.lazxnet.e_commer.products.Service;

import com.lazxnet.e_commer.products.Entity.Product;
import com.lazxnet.e_commer.products.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    //Crear productos
    public Product createProduct(Product product){
        return productRepository.save(product);
    }

    //Obtener todos los productos
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    //Eliminar productos por id
    public Product deleteProductById(UUID id){
        Product product = productRepository.findById(id).orElse(null);

        if (product != null){
            productRepository.delete(product);
        }
        return product;
    }
}
