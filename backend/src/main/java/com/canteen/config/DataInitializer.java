package com.canteen.config;

import com.canteen.model.*;
import com.canteen.repository.CategoryRepository;
import com.canteen.repository.MenuItemRepository;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedCategoriesAndMenuItems();
        seedInitialOrders();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User student = new User("Rahul Sharma", "student@canteen.com", passwordEncoder.encode("password123"), "9876543210", Role.ROLE_CUSTOMER, 500.0);
            User staff = new User("Chef Mohan", "staff@canteen.com", passwordEncoder.encode("password123"), "9876543211", Role.ROLE_STAFF, 0.0);
            User admin = new User("Canteen Manager", "admin@canteen.com", passwordEncoder.encode("password123"), "9876543212", Role.ROLE_ADMIN, 0.0);

            userRepository.saveAll(Arrays.asList(student, staff, admin));
            System.out.println(">>> Demo users seeded successfully (student@canteen.com, staff@canteen.com, admin@canteen.com / password123)");
        }
    }

    private void seedCategoriesAndMenuItems() {
        if (categoryRepository.count() == 0) {
            Category breakfast = categoryRepository.save(new Category("Breakfast", "Fresh morning breakfast items", "Utensils"));
            Category meals = categoryRepository.save(new Category("Meals & Thali", "Wholesome lunch & dinner plates", "Bowl"));
            Category snacks = categoryRepository.save(new Category("Snacks & Fast Food", "Quick bites and refreshments", "Sandwich"));
            Category beverages = categoryRepository.save(new Category("Beverages & Juices", "Hot tea, coffee, and chilled drinks", "Coffee"));
            Category desserts = categoryRepository.save(new Category("Desserts & Sweets", "Sweet delights after meals", "IceCream"));

            List<MenuItem> items = Arrays.asList(
                    new MenuItem("Masala Dosa", "Crispy golden crepe filled with spiced potato masala, served with 2 chutneys & sambar", 60.0, "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80", true, true, 8, breakfast),
                    new MenuItem("Idli Vada Sambar Combo", "2 Steamed fluffy idlis and 1 crispy medu vada with aromatic sambar and coconut chutney", 45.0, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", true, true, 5, breakfast),
                    new MenuItem("Special Veg Thali", "Steamed basmati rice, 2 rotis, paneer sabzi, dal tadka, salad, curd, and papad", 120.0, "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80", true, true, 12, meals),
                    new MenuItem("Paneer Butter Masala Bowl", "Rich creamy tomato-butter paneer gravy served with fragrant jeera rice", 140.0, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80", true, true, 10, meals),
                    new MenuItem("Hyderabadi Chicken Biryani", "Aromatic long-grain basmati rice cooked with tender spiced chicken pieces and raita", 160.0, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80", false, true, 10, meals),
                    new MenuItem("Crispy Veg Burger Combo", "Crunchy spiced potato-herb patty with lettuce, house sauce, and golden salted fries", 85.0, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", true, true, 10, snacks),
                    new MenuItem("Punjabi Samosa (2 Pcs)", "Flaky crust pastries stuffed with spiced potatoes and green peas, served with sweet tamarind and mint chutneys", 30.0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", true, true, 5, snacks),
                    new MenuItem("Cold Coffee with Ice Cream", "Rich creamy blended espresso shake topped with a scoop of vanilla ice cream", 55.0, "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80", true, true, 5, beverages),
                    new MenuItem("Kullad Masala Chai", "Authentic slow-brewed Indian tea with ginger and green cardamom, served in traditional clay cup", 20.0, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80", true, true, 5, beverages),
                    new MenuItem("Hot Gulab Jamun (2 Pcs)", "Soft melt-in-mouth milk dumplings soaked in fragrant rose-cardamom sugar syrup", 40.0, "https://images.unsplash.com/photo-1605197147743-4f9e42c5c99a?auto=format&fit=crop&w=600&q=80", true, true, 3, desserts)
            );

            menuItemRepository.saveAll(items);
            System.out.println(">>> Categories and Menu Items seeded successfully!");
        }
    }

    private void seedInitialOrders() {
        if (orderRepository.count() == 0) {
            User student = userRepository.findByEmail("student@canteen.com").orElse(null);
            MenuItem dosa = menuItemRepository.findAll().stream().filter(m -> m.getName().contains("Dosa")).findFirst().orElse(null);
            MenuItem chai = menuItemRepository.findAll().stream().filter(m -> m.getName().contains("Chai")).findFirst().orElse(null);
            MenuItem thali = menuItemRepository.findAll().stream().filter(m -> m.getName().contains("Thali")).findFirst().orElse(null);

            if (student != null && dosa != null && chai != null) {
                // Seed a "PREPARING" order for kitchen display
                Order order1 = new Order("#TK-101", OrderStatus.PREPARING, 80.0, "WALLET", "PAID", "Less oil please", student);
                OrderItem item1 = new OrderItem(order1, dosa, 1, dosa.getPrice());
                OrderItem item2 = new OrderItem(order1, chai, 1, chai.getPrice());
                order1.setItems(new ArrayList<>(Arrays.asList(item1, item2)));
                orderRepository.save(order1);

                // Seed a "READY_FOR_PICKUP" order for pickup demonstration
                if (thali != null) {
                    Order order2 = new Order("#TK-102", OrderStatus.READY_FOR_PICKUP, 120.0, "UPI", "PAID", "Extra papad", student);
                    OrderItem item3 = new OrderItem(order2, thali, 1, thali.getPrice());
                    order2.setItems(new ArrayList<>(Arrays.asList(item3)));
                    orderRepository.save(order2);
                }

                System.out.println(">>> Sample orders seeded for live demonstration (#TK-101 in PREPARING, #TK-102 in READY_FOR_PICKUP)");
            }
        }
    }
}
