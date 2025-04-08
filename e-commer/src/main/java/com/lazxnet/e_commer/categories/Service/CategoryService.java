package com.lazxnet.e_commer.categories.Service;

import com.lazxnet.e_commer.categories.Entity.Category;
import com.lazxnet.e_commer.categories.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    //Crear Categoria
    public  Category createCategory(Category category) {

        return categoryRepository.save(category);
    }

    //Obtener todas las Categorias
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    //Borrar categoria por id
    public Category deleteCategoryById(UUID id) {
        Category category = categoryRepository.findById(id).orElse(null);
        categoryRepository.delete(category);
        return category;
    }
}
