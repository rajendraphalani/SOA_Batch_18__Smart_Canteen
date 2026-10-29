package com.canteen.dto;

import java.util.Map;

public class AnalyticsResponse {
    private Double todayRevenue;
    private Long todayOrdersCount;
    private Long pendingOrdersCount;
    private Long readyOrdersCount;
    private Long completedOrdersCount;
    private Map<String, Long> statusDistribution;

    public AnalyticsResponse() {}

    public AnalyticsResponse(Double todayRevenue, Long todayOrdersCount, Long pendingOrdersCount, Long readyOrdersCount, Long completedOrdersCount, Map<String, Long> statusDistribution) {
        this.todayRevenue = todayRevenue;
        this.todayOrdersCount = todayOrdersCount;
        this.pendingOrdersCount = pendingOrdersCount;
        this.readyOrdersCount = readyOrdersCount;
        this.completedOrdersCount = completedOrdersCount;
        this.statusDistribution = statusDistribution;
    }

    public Double getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(Double todayRevenue) { this.todayRevenue = todayRevenue; }

    public Long getTodayOrdersCount() { return todayOrdersCount; }
    public void setTodayOrdersCount(Long todayOrdersCount) { this.todayOrdersCount = todayOrdersCount; }

    public Long getPendingOrdersCount() { return pendingOrdersCount; }
    public void setPendingOrdersCount(Long pendingOrdersCount) { this.pendingOrdersCount = pendingOrdersCount; }

    public Long getReadyOrdersCount() { return readyOrdersCount; }
    public void setReadyOrdersCount(Long readyOrdersCount) { this.readyOrdersCount = readyOrdersCount; }

    public Long getCompletedOrdersCount() { return completedOrdersCount; }
    public void setCompletedOrdersCount(Long completedOrdersCount) { this.completedOrdersCount = completedOrdersCount; }

    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
}
