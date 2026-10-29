package com.canteen.controller;

import com.canteen.dto.AnalyticsResponse;
import com.canteen.model.Order;
import com.canteen.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(orderService.getAnalytics());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
