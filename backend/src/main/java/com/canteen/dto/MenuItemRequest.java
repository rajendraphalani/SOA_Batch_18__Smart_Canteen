package com.canteen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class MenuItemRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    @Positive
    private Double price;

    private String imageUrl;
    private Boolean isVeg = true;
    private Boolean isAvailable = true;
    private Integer prepTimeMinutes = 10;

    @NotNull
    private Long categoryId;

    public MenuItemRequest() {}

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

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
