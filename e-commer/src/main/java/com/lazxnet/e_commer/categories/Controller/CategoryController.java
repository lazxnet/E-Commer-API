package com.lazxnet.e_commer.categories.Controller;

import com.lazxnet.e_commer.categories.DTO.CategoryRequestDTO;
import com.lazxnet.e_commer.categories.DTO.CategoryResponseDTO;
import com.lazxnet.e_commer.categories.Entity.Category;
import com.lazxnet.e_commer.categories.Service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Category")

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;


    //Crear Categoria
    @Operation(
            summary = "Crear Categoria (Solo administradores)",
            description = "Endpoint para crear una nueva categoria",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "datos de la categoria",
                    required = true
            )
    )
    @PostMapping("/createcategory")
    public ResponseEntity<CategoryResponseDTO> createCategory(
            @RequestBody CategoryRequestDTO categoryRequest,
            @RequestParam("UserAdminId") UUID userAdminId
    ) {
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());

        CategoryResponseDTO responseDTO = categoryService.createCategory(category, userAdminId);
        return  ResponseEntity.ok(responseDTO);
    }

    //Obtener todas las categorias
    @Operation(
            summary = "Obtener todas las categorias",
            description = "Endpoint para obtener todas las categorias"
    )
    @GetMapping("/showall_categories")
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }

    //Borrar categoria por id
    @Operation(
            summary = "Borrar categoria por ID (Solo administradores)",
            description = "Endpoint para eliminar una categoria utilizando su ID"
    )
    @DeleteMapping("/delete_category/{categoryId}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable UUID categoryId,
            @RequestParam("UserAdminId") UUID userAdminId
    ) {

        categoryService.deleteCategoryById(categoryId, userAdminId);
        return ResponseEntity.ok("Categoria eliminada correctamente");
    }

}
