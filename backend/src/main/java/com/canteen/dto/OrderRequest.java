package com.canteen.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class OrderRequest {
    @NotEmpty
    private List<OrderItemRequest> items;

    private String paymentMethod = "WALLET"; // WALLET, UPI, CASH
    private String notes;

    public OrderRequest() {}

    public OrderRequest(List<OrderItemRequest> items, String paymentMethod, String notes) {
        this.items = items;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
    }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
