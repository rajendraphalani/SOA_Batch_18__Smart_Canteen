package com.canteen.controller;

import com.canteen.dto.StatusUpdateRequest;
import com.canteen.model.Order;
import com.canteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kitchen")
@PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_ADMIN')")
public class KitchenController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getKitchenOrders() {
        return ResponseEntity.ok(orderService.getActiveKitchenOrders());
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        try {
            Order updated = orderService.updateOrderStatus(id, request.getStatus());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/orders/verify")
    public ResponseEntity<?> verifyTokenAndCollect(@RequestBody Map<String, String> payload) {
        String token = payload.get("tokenNumber");
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Token number is required"));
        }
        try {
            Order updated = orderService.verifyAndCollect(token);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
