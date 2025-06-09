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
@CrossOrigin(origins = "*")
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    //Crear productos
    @Operation(
            summary = "Crear Producto (Solo administradores)",
            description = "Endpoint para crear un nuevo producto",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del producto",
                    required = true
            )
    )
    @PostMapping()
    public ResponseEntity<ProductResponse> createProduct(
            @RequestBody ProductRequest productRequest,
            @RequestHeader("UserAdminId") UUID userAdminId
    ) {
        Product savedProduct = productService.createProduct(productRequest, userAdminId);
        ProductResponse response = productService.convertToResponse(savedProduct);
        return ResponseEntity.ok(response);
    }

    //Obtener todos los Productos
    @Operation(
            summary = "Obtener todos los productos (Todos)",
            description = "Endpoint para obtener todos los productos"
    )
    @GetMapping()
    public List<ProductResponse> getAllProducts(){
        return productService.getAllProducts();
    }

    //Editar un producto por id
    @Operation(
            summary = "Actualizar producto por ID (Solo administradores)",
            description = "Endpoint para editar un producto"
    )
    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable UUID productId,
            @RequestBody ProductRequest productRequest,
            @RequestHeader("UserAdminId") UUID userAdminId) {
        ProductResponse updatedProduct = productService.updateProduct(productId, productRequest, userAdminId);
        return ResponseEntity.ok(updatedProduct);
    }


    //Filtrar productos por categoria
    @Operation(
            summary = "Filtrar productos por categoría (Todos)",
            description = "Endpoint para obtener productos asociados a una categoría específica"
    )
    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(
            @PathVariable UUID categoryId) {
        List<ProductResponse> products = productService.getProductsByCategoryId(categoryId);
        return ResponseEntity.ok(products);
    }

    //Borrar un producto
    @Operation(
        summary = "Eliminar un producto",
        description = "Endpoint para eliminar un producto por id"
    )
    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(
        @PathVariable UUID productId,
        @RequestHeader("UserAdminId") UUID userAdminId
    ){
        String message = productService.deleteProductById(productId, userAdminId);
        return ResponseEntity.ok(message);
    }
}
