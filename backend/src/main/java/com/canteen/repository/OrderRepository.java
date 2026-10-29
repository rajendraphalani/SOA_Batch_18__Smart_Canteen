package com.canteen.repository;

import com.canteen.model.Order;
import com.canteen.model.OrderStatus;
import com.canteen.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByTokenNumber(String tokenNumber);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :since")
    Long countOrdersSince(LocalDateTime since);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.createdAt >= :since AND o.status != 'CANCELLED'")
    Double sumRevenueSince(LocalDateTime since);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();
}
