const { gql } = require('apollo-server-express');
const { supabase } = require('./supabaseClient');

const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    email: String!
    name: String
  }

  type Event {
    id: ID!
    name: String!
    description: String
    date: DateTime!
    total_seats: Int!
    available_seats: Int!
  }

  type Booking {
    id: ID!
    user: User!
    event: Event!
    seats_booked: Int!
    created_at: DateTime!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    bookings(user_id: ID!): [Booking!]!
  }

  type Mutation {
    createUser(email: String!, name: String): User!
    createEvent(name: String!, description: String, date: DateTime!, total_seats: Int!): Event!
    bookEvent(userEmail: String!, eventId: ID!, seats: Int!): Booking!
    updateBooking(bookingId: ID!, seats: Int!): Booking!
    cancelBooking(bookingId: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    events: async () => {
      const { data, error } = await supabase.from('events').select('*');
      if (error) throw new Error(error.message);
      return data;
    },
    event: async (_, { id }) => {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    },
    bookings: async (_, { user_id }) => {
      const { data, error } = await supabase.from('bookings').select('*').eq('user_id', user_id);
      if (error) throw new Error(error.message);
      return data;
    }
  },
  Mutation: {
    createUser: async (_, { email, name }) => {
      const { data, error } = await supabase
        .from('users')
        .insert([{ email, name }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    createEvent: async (_, { name, description, date, total_seats }) => {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            name,
            description,
            date,
            total_seats,
            available_seats: total_seats,
          },
        ])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    bookEvent: async (_, { userEmail, eventId, seats }) => {
      // Get or create user
      let { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (!user) {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ email: userEmail }])
          .select()
          .single();
        if (createError) throw new Error(createError.message);
        user = newUser;
      }

      // Create booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user.id,
            event_id: eventId,
            seats_booked: seats,
          },
        ])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    updateBooking: async (_, { bookingId, seats }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ seats_booked: seats })
        .eq('id', bookingId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    cancelBooking: async (_, { bookingId }) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      if (error) throw new Error(error.message);
      return true;
    }
  },
  Booking: {
    user: async (parent) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', parent.user_id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    event: async (parent) => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', parent.event_id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  }
};

module.exports = { typeDefs, resolvers };
