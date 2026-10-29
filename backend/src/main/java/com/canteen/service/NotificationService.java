package com.canteen.service;

import com.canteen.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyKitchen(Order order) {
        try {
            messagingTemplate.convertAndSend("/topic/kitchen-orders", order);
        } catch (Exception e) {
            System.err.println("Failed to send WebSocket notification to kitchen: " + e.getMessage());
        }
    }

    public void notifyOrderStatus(Order order) {
        try {
            // Update kitchen board
            messagingTemplate.convertAndSend("/topic/kitchen-orders", order);
            // Update customer tracking screen
            messagingTemplate.convertAndSend("/topic/order/" + order.getId(), order);
        } catch (Exception e) {
            System.err.println("Failed to send WebSocket notification for order: " + e.getMessage());
        }
    }
}
