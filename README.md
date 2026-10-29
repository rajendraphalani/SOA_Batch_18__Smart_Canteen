# 🍽️ Smart Canteen Ordering and Management System

A modern full-stack web application built with **Spring Boot 3** and **React** designed to streamline institutional food ordering, eliminate queue congestion, and provide real-time coordination between students, kitchen chefs, and canteen management.

---

## 🚀 Key Features

* **🧑‍🎓 Customer Experience**:
  * Browse categorized live menu (Breakfast, Meals, Snacks, Beverages, Desserts).
  * Vegetarian / Non-Vegetarian and dietary filters with real-time stock status.
  * Smart Cart with item customization and special cooking notes.
  * Digital Payment Simulator (Canteen Wallet with starting balance of ₹500, UPI, Cash at Counter).
  * **Digital Token & Scannable QR Code** generation (e.g. `#TK-101`) for quick pickup verification.
  * **Real-time Live Order Tracker** with stage progression (`PLACED` ➔ `PREPARING` ➔ `READY FOR PICKUP` ➔ `COLLECTED`).
  * Order history with digital receipts.

* **👨‍🍳 Kitchen Display System (KDS)**:
  * Real-time Kanban board with 3 automated columns:
    * 🟡 **Incoming Orders**: Accept and move to preparation.
    * 🔵 **In Preparation**: Chef cooking timer and action to mark ready for pickup.
    * 🟢 **Ready for Pickup**: Ready for student collection at Counter #1.
  * **Token / Barcode Scanner Input**: Fast lookup to verify customer QR tokens and complete handovers.
  * **Instant Stock Switcher**: Mark dishes as "Sold Out" or "In Stock" on the fly.

* **📊 Canteen Admin Dashboard**:
  * Real-time revenue & sales analytics.
  * Live status distribution charts.
  * Full Menu Catalog Manager (Add new dishes, update prices, upload images, delete items).
  * Complete order audit log.

---

## 🛠️ Tech Stack

* **Backend**: Java (Spring Boot 3.3.4), Spring Security + JWT, Spring Data JPA, Spring WebSocket (STOMP), H2 Database (Persistent file storage).
* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, `qrcode.react`, Canvas Confetti, Axios.
* **Database**: Embedded persistent H2 (`./data/canteendb`). Zero configuration required.

---

## 🔑 Pre-seeded Demo Accounts

| Role | Email | Password | Pre-loaded Wallet |
| :--- | :--- | :--- | :--- |
| **Student / Customer** | `student@canteen.com` | `password123` | ₹500.00 |
| **Kitchen Staff** | `staff@canteen.com` | `password123` | N/A |
| **Canteen Admin** | `admin@canteen.com` | `password123` | N/A |

> **Tip**: You can switch between roles instantly using the role toggle buttons in the top navbar!

---

## 🏃 How to Run the Project

### 1. Start the Spring Boot Backend
Open a terminal in `smart-canteen/backend` and run:
```bash
mvn spring-boot:run
```
* Backend starts at: `http://localhost:8080`
* H2 Database Console: `http://localhost:8080/h2-console`
  * JDBC URL: `jdbc:h2:file:./data/canteendb`
  * User: `sa`
  * Password: `password`

### 2. Start the React Frontend
Open another terminal in `smart-canteen/frontend` and run:
```bash
npm run dev
```
* Frontend starts at: `http://localhost:5173`

---

## 🧪 Testing the Complete Workflow

1. Open `http://localhost:5173` in your browser.
2. The navbar will show you logged in as **Customer** with ₹500 wallet balance.
3. Browse the menu, add items to cart (e.g. Masala Dosa, Kullad Chai).
4. Open the cart drawer, add a note (e.g. "Less spicy"), select **Canteen Wallet**, and click **Confirm & Pay**.
5. You will see a celebration with your **Digital Pickup Token** and **Scannable QR Code**!
6. Click **Track Live Status** to watch the progress bar.
7. Click the **Kitchen (KDS)** tab in the navbar to see the order immediately in the chef's queue.
8. Click **Start Preparing** and then **Mark Ready for Pickup**.
9. Notice how the customer tracking screen reflects the update instantly!
10. Click the **Admin** tab to view your updated revenue and sales statistics.
