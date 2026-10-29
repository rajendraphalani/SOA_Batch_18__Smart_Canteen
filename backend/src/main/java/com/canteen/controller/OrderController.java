package com.canteen.controller;

import com.canteen.dto.OrderRequest;
import com.canteen.model.Order;
import com.canteen.model.User;
import com.canteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal User user, @Valid @RequestBody OrderRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Please login to place an order"));
        }
        try {
            Order order = orderService.createOrder(user, request);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Not authenticated"));
        }
        List<Order> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
