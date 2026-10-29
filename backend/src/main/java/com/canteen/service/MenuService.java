package com.canteen.service;

import com.canteen.dto.MenuItemRequest;
import com.canteen.model.Category;
import com.canteen.model.MenuItem;
import com.canteen.repository.CategoryRepository;
import com.canteen.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<MenuItem> getAllAvailableItems() {
        return menuItemRepository.findByIsAvailableTrue();
    }

    public List<MenuItem> getAllItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem createMenuItem(MenuItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        MenuItem item = new MenuItem(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getImageUrl(),
                request.getIsVeg() != null ? request.getIsVeg() : true,
                request.getIsAvailable() != null ? request.getIsAvailable() : true,
                request.getPrepTimeMinutes() != null ? request.getPrepTimeMinutes() : 10,
                category
        );

        return menuItemRepository.save(item);
    }

    public MenuItem updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setIsVeg(request.getIsVeg());
        item.setIsAvailable(request.getIsAvailable());
        item.setPrepTimeMinutes(request.getPrepTimeMinutes());
        item.setCategory(category);

        return menuItemRepository.save(item);
    }

    public MenuItem toggleAvailability(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        item.setIsAvailable(!item.getIsAvailable());
        return menuItemRepository.save(item);
    }

    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}
