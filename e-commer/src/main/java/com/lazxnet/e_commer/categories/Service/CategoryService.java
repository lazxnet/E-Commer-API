package com.lazxnet.e_commer.categories.Service;

import com.lazxnet.e_commer.categories.DTO.CategoryResponseDTO;
import com.lazxnet.e_commer.categories.Entity.Category;
import com.lazxnet.e_commer.categories.Repository.CategoryRepository;
import com.lazxnet.e_commer.userAdmin.Entity.UserAdmin;
import com.lazxnet.e_commer.userAdmin.Repository.UserAdminRepository;
import com.lazxnet.e_commer.userAdmin.dto.UserAdminResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserAdminRepository userAdminRepository;

    //Crear Categoria
    public CategoryResponseDTO createCategory(Category category, UUID userAdminId) {

        //TODO: Validar que el UserAdminId exista
        UserAdmin userAdmin = userAdminRepository.findById(userAdminId)
                .orElseThrow(()-> new RuntimeException("UserAdmin no encontrado"));

        category.setUserAdmin(userAdmin);
        Category savedCategory = categoryRepository.save(category);
        return convertToResponseDTO(savedCategory);
    }


    //Metodo para convectir entidad a DTO
    private CategoryResponseDTO convertToResponseDTO(Category category) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());

        //Convertir UserAdmin a UserAdminResponseDTO
        UserAdmin userAdmin = category.getUserAdmin();
        UserAdminResponseDTO userAdminDTO = new UserAdminResponseDTO();
        userAdminDTO.setUserAdminId(userAdmin.getUserAdminId());
        userAdminDTO.setEmail(userAdmin.getEmail());
        userAdminDTO.setFullName(userAdmin.getFullName());

        dto.setUserAdmin(userAdminDTO);
        return dto;
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
