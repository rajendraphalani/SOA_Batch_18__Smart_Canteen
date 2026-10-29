package com.canteen.dto;

import com.canteen.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {
    @NotNull
    private OrderStatus status;

    public StatusUpdateRequest() {}

    public StatusUpdateRequest(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
