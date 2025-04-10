package com.lazxnet.e_commer.products.Service;

import com.lazxnet.e_commer.categories.Entity.Category;
import com.lazxnet.e_commer.categories.Repository.CategoryRepository;
import com.lazxnet.e_commer.products.Repository.ImageProductRepository;
import com.lazxnet.e_commer.products.Entity.ImageProduct;
import com.lazxnet.e_commer.products.Entity.Product;
import com.lazxnet.e_commer.products.Repository.ProductRepository;
import com.lazxnet.e_commer.products.dto.ProductRequest;
import com.lazxnet.e_commer.products.dto.ProductResponse;
import com.lazxnet.e_commer.userAdmin.Entity.UserAdmin;
import com.lazxnet.e_commer.userAdmin.Repository.UserAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ImageProductRepository imageProductRepository;

    @Autowired
    private UserAdminRepository userAdminRepository;

    //Crear productos
    public Product createProduct(ProductRequest productRequest, UUID userAdminId) {

        //Validar categoria
        Category category = categoryRepository.findById(productRequest
                .getCategoryId())
                .orElseThrow(()-> new RuntimeException("Categoria no encontrada"));

        //Validar userAdminId
        UserAdmin userAdmin = userAdminRepository.findById(userAdminId)
                .orElseThrow(()-> new RuntimeException("Administrador no encontrado"));

        //Crear imagen y producto
        ImageProduct imageProduct = new ImageProduct();
        imageProduct.setImageBase64(productRequest.getImageBase64());
        imageProduct = imageProductRepository.save(imageProduct);

        Product product = new Product();
        product.setImageProduct(imageProduct);
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        product.setCategory(category);
        product.setUserAdmin(userAdmin);

        return productRepository.save(product);
    }

    //Obtener todos los productos
    public List<ProductResponse> getAllProducts(){
        List<Product> products = productRepository.findAll();
        List<ProductResponse> responses = new ArrayList<>();

        for(Product product : products){
            ProductResponse response = new ProductResponse();
            response.setProductId(product.getProductId());
            response.setImageBase64(product.getImageProduct().getImageBase64());
            response.setName(product.getName());
            response.setDescription(product.getDescription());
            response.setPrice(product.getPrice());
            response.setCategory(product.getCategory());
            responses.add(response);
        }
        return responses;
    }

    //Editar un producto
    public ProductResponse updateProduct(UUID productId, ProductRequest productRequest, UUID userAdminId) {

        //Validar que si administrador existente
        UserAdmin userAdmin = userAdminRepository.findById(userAdminId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Administrador no encontrado"
                ));

        //Validar el producto existente
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(()-> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El producto con ID " + productId + " no existe"
                ));

        if (productRequest.getQuantity() != null){
            existingProduct.setQuantity(productRequest.getQuantity());
        }

        if (productRequest.getImageBase64() != null){
            ImageProduct imageProduct = existingProduct.getImageProduct();
            imageProduct.setImageBase64(productRequest.getImageBase64());
            imageProductRepository.save(imageProduct);
        }

        //TODO: Buscar la nueva categoria(Si se decea actualizarla)
        Category category = categoryRepository.findById(productRequest.getCategoryId())
                .orElseThrow(()-> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "La categoria con ID " + productRequest.getCategoryId() + " no existe"
                ));

        //Actualizar campos
        existingProduct.setName(productRequest.getName());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setPrice(productRequest.getPrice());
        existingProduct.setCategory(category);

        //Guardar cambios
        Product updatedProduct = productRepository.save(existingProduct);
        return convertToResponse(updatedProduct);
    }

    //TODO: Metodo para convertir Product a ProductResponse
    private ProductResponse convertToResponse(Product product){
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setImageBase64(product.getImageProduct().getImageBase64());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setQuantity(product.getQuantity());
        response.setCategory(product.getCategory());
        return response;
    }

    //Eliminar productos por id
    public Product deleteProductById(UUID id){
        Product product = productRepository.findById(id).orElse(null);

        if (product != null){
            productRepository.delete(product);
        }
        return product;
    }

    //Obtener productos por categoria
    public List<ProductResponse> getProductsByCategoryId(UUID categoryId){
        List<Product> products = productRepository.findByCategory_CategoryId(categoryId);
        List<ProductResponse> responses = new ArrayList<>();

        for(Product product : products){
            ProductResponse response = convertToResponse(product);
            responses.add(response);
        }

        return responses;
    }
}
