package com.lazxnet.e_commer.products.Controller;

import com.lazxnet.e_commer.products.Entity.Product;
import com.lazxnet.e_commer.products.Service.ProductService;
import com.lazxnet.e_commer.products.dto.ProductRequest;
import com.lazxnet.e_commer.products.dto.ProductResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Products")

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    //Crear productos
    @Operation(
            summary = "Crear Producto",
            description = "Endpoint para crear un nuevo producto",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del producto",
                    required = true
            )
    )
    @PostMapping("/createproduct")
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest productRequest) {
        Product savedProduct = productService.createProduct(productRequest);
        return ResponseEntity.ok(savedProduct);
    }

    //Obtener todos los Productos
    @Operation(
            summary = "Obtener todos los productos",
            description = "Endpoint para obtener todos los productos"
    )
    @GetMapping("/showallproducts")
    public List<ProductResponse> getAllProducts(){
        return productService.getAllProducts();
    }

    //Editar un producto por id
    @Operation(
            summary = "Actualizar producto por ID",
            description = "Endpoint para editar un producto"
    )
    @PutMapping("/update_product/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable UUID id,
            @RequestBody ProductRequest productRequest) {
        ProductResponse updatedProduct = productService.updateProduct(id, productRequest);
        return ResponseEntity.ok(updatedProduct);
    }


    //Filtrar productos por categoria
    @Operation(
            summary = "Filtrar productos por categoría",
            description = "Endpoint para obtener productos asociados a una categoría específica"
    )
    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(
            @PathVariable UUID categoryId) {
        List<ProductResponse> products = productService.getProductsByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }
}
