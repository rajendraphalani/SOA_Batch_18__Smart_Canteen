package com.canteen.service;

import com.canteen.dto.AnalyticsResponse;
import com.canteen.dto.OrderItemRequest;
import com.canteen.dto.OrderRequest;
import com.canteen.model.*;
import com.canteen.repository.MenuItemRepository;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Order createOrder(User user, OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        double totalAmount = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PLACED);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "WALLET");
        order.setNotes(request.getNotes());

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem item = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + itemReq.getMenuItemId()));

            if (!item.getIsAvailable()) {
                throw new RuntimeException("Item is currently out of stock: " + item.getName());
            }

            double itemTotal = item.getPrice() * itemReq.getQuantity();
            totalAmount += itemTotal;

            OrderItem orderItem = new OrderItem(order, item, itemReq.getQuantity(), item.getPrice());
            orderItems.add(orderItem);
        }

        order.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);
        order.setItems(orderItems);

        // Process wallet deduction if paying with wallet
        if ("WALLET".equalsIgnoreCase(order.getPaymentMethod())) {
            User dbUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (dbUser.getWalletBalance() < order.getTotalAmount()) {
                throw new RuntimeException(String.format("Insufficient wallet balance. Needed: ₹%.2f, Available: ₹%.2f",
                        order.getTotalAmount(), dbUser.getWalletBalance()));
            }

            dbUser.setWalletBalance(Math.round((dbUser.getWalletBalance() - order.getTotalAmount()) * 100.0) / 100.0);
            userRepository.save(dbUser);
            order.setPaymentStatus("PAID");
        } else {
            order.setPaymentStatus("PAID"); // Mock UPI / Card auto-approves
        }

        // Generate guaranteed unique Token Number like #TK-103
        String token = generateUniqueToken();
        order.setTokenNumber(token);

        Order savedOrder = orderRepository.save(order);

        // Notify kitchen live
        notificationService.notifyKitchen(savedOrder);

        return savedOrder;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public List<Order> getActiveKitchenOrders() {
        return orderRepository.findByStatusInOrderByCreatedAtAsc(
                Arrays.asList(OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP)
        );
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = getOrderById(id);
        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);

        notificationService.notifyOrderStatus(updated);
        return updated;
    }

    @Transactional
    public Order verifyAndCollect(String tokenNumber) {
        String cleanToken = tokenNumber.trim();
        if (!cleanToken.startsWith("#")) {
            cleanToken = "#" + cleanToken;
        }

        Order order = orderRepository.findByTokenNumber(cleanToken)
                .orElseThrow(() -> new RuntimeException("No order found with token: " + tokenNumber));

        if (order.getStatus() == OrderStatus.COLLECTED) {
            throw new RuntimeException("Order is already collected!");
        }

        order.setStatus(OrderStatus.COLLECTED);
        Order updated = orderRepository.save(order);

        notificationService.notifyOrderStatus(updated);
        return updated;
    }

    public AnalyticsResponse getAnalytics() {
        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);

        Double todayRevenue = orderRepository.sumRevenueSince(startOfToday);
        Long todayOrders = orderRepository.countOrdersSince(startOfToday);

        List<Order> activeOrders = getActiveKitchenOrders();
        long pending = activeOrders.stream().filter(o -> o.getStatus() == OrderStatus.PLACED).count();
        long preparing = activeOrders.stream().filter(o -> o.getStatus() == OrderStatus.PREPARING).count();
        long ready = activeOrders.stream().filter(o -> o.getStatus() == OrderStatus.READY_FOR_PICKUP).count();
        long completed = orderRepository.count() - activeOrders.size();

        Map<String, Long> statusDist = new HashMap<>();
        statusDist.put("PLACED", pending);
        statusDist.put("PREPARING", preparing);
        statusDist.put("READY_FOR_PICKUP", ready);
        statusDist.put("COLLECTED", Math.max(0, completed));

        return new AnalyticsResponse(
                todayRevenue != null ? Math.round(todayRevenue * 100.0) / 100.0 : 0.0,
                todayOrders != null ? todayOrders : 0L,
                pending + preparing,
                ready,
                Math.max(0, completed),
                statusDist
        );
    }

    private synchronized String generateUniqueToken() {
        long count = orderRepository.count() + 1;
        long num = 100 + (count % 900);
        String candidate = String.format("#TK-%03d", num);
        while (orderRepository.findByTokenNumber(candidate).isPresent()) {
            num++;
            if (num > 999) num = 101;
            candidate = String.format("#TK-%03d", num);
        }
        return candidate;
    }
}
