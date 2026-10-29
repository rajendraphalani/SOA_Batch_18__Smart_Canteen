package com.canteen.controller;

import com.canteen.dto.MenuItemRequest;
import com.canteen.model.Category;
import com.canteen.model.MenuItem;
import com.canteen.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(menuService.getAllCategories());
    }

    @GetMapping("/items")
    public ResponseEntity<List<MenuItem>> getAvailableItems() {
        return ResponseEntity.ok(menuService.getAllAvailableItems());
    }

    @GetMapping("/all")
    public ResponseEntity<List<MenuItem>> getAllItems() {
        return ResponseEntity.ok(menuService.getAllItems());
    }

    @PostMapping("/items")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        try {
            MenuItem item = menuService.createMenuItem(request);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/items/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request) {
        try {
            MenuItem item = menuService.updateMenuItem(id, request);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PatchMapping("/items/{id}/toggle")
    @PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_ADMIN')")
    public ResponseEntity<?> toggleItemStock(@PathVariable Long id) {
        try {
            MenuItem item = menuService.toggleAvailability(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        try {
            menuService.deleteMenuItem(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Item deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
