package com.lazxnet.e_commer.categories.Controller;

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
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;


    //Crear Categoria
    @Operation(
            summary = "Crear Categoria",
            description = "Endpoint para crear una nueva categoria",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "datos de la categoria",
                    required = true
            )
    )
    @PostMapping("/createcategory")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category saveCategory = categoryService.createCategory(category);
        return ResponseEntity.ok(saveCategory);
    }

    //Obtener todas las categorias
    @Operation(
            summary = "Obtener todas las categorias",
            description = "Endpoint para obtener todas las categorias"
    )
    @GetMapping("/showall_categories")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    //Borrar categoria por id
    @Operation(
            summary = "Borrar categoria por ID",
            description = "Endpoint para eliminar una categoria utilizando su ID"
    )
    @DeleteMapping("/delete_category/{id}")
    public ResponseEntity<Category> deleteCategory(@PathVariable UUID id) {
        Category deletedCategory = categoryService.deleteCategoryById(id);
        return ResponseEntity.ok(deletedCategory);
    }

}
