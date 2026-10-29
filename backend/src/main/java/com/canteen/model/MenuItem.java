package com.canteen.model;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double price;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean isVeg = true;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    private Integer prepTimeMinutes = 10;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    public MenuItem() {}

    public MenuItem(String name, String description, Double price, String imageUrl, Boolean isVeg, Boolean isAvailable, Integer prepTimeMinutes, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.isVeg = isVeg;
        this.isAvailable = isAvailable;
        this.prepTimeMinutes = prepTimeMinutes;
        this.category = category;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean isVeg) { this.isVeg = isVeg; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Integer getPrepTimeMinutes() { return prepTimeMinutes; }
    public void setPrepTimeMinutes(Integer prepTimeMinutes) { this.prepTimeMinutes = prepTimeMinutes; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
