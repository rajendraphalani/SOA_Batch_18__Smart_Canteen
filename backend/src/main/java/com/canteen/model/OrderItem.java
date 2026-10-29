package com.canteen.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double itemPrice;

    public OrderItem() {}

    public OrderItem(Order order, MenuItem menuItem, Integer quantity, Double itemPrice) {
        this.order = order;
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.itemPrice = itemPrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem menuItem) { this.menuItem = menuItem; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getItemPrice() { return itemPrice; }
    public void setItemPrice(Double itemPrice) { this.itemPrice = itemPrice; }
}
