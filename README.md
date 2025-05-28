# 📦 Event Booking System – Backend

This is the backend server for the **Event Booking System**, built using **Node.js**, **GraphQL**, and **Supabase (PostgreSQL)**. It handles user registrations, event listings, and seat bookings.

---

## 🚀 Features

* User Registration
* Event Creation & Listing
* Seat Booking
* Supabase as Database
* GraphQL API (Apollo Server)

---

## 🛠️ Tech Stack

* Node.js
* GraphQL
* Apollo Server
* Supabase (PostgreSQL)

---

## 📁 Project Structure

```bash
├── src
│   ├── index.js             # Entry point
│   ├── schema.js            # GraphQL schema & resolvers
│   └── supabaseClient.js    # Supabase client config
├── package.json
└── README.md
```

---

## 🔧 Setup Instructions

1. **Clone the Repository:**

```bash
git clone https://github.com/your-username/event-booking-system.git
cd event-booking-system
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Configure Supabase:**
   Update your `supabaseClient.js` file with your Supabase URL and API key:

```js
const supabase = createClient(
  'https://your-supabase-url.supabase.co',
  'your-anon-key'
);
```

4. **Run the Server:**

```bash
node src/index.js
```

---

## 🔍 Sample GraphQL Queries

### Create User

```graphql
mutation {
  createUser(email: "user@example.com", name: "Mithun") {
    id
    email
    name
  }
}
```

### List Events

```graphql
query {
  events {
    id
    name
    description
    date
    available_seats
  }
}
```

### Book Event

```graphql
mutation {
  bookEvent(userId: "user-uuid", eventId: "event-uuid", seats: 2) {
    id
    seats_booked
    created_at
  }
}
```

---

## 🧪 Testing

Use GraphQL Playground or Postman to test the GraphQL endpoints at:

```
http://localhost:4000/
```

---

## 🧾 License

This project is licensed under the MIT License.
