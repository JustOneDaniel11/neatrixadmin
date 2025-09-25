import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Types (updated to match Supabase schema)
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  firstName?: string;
  lastName?: string;
  joinDate?: string;
  totalSpent?: number;
  status?: 'active' | 'inactive';
}

export interface Booking {
  id: string;
  user_id: string;
  service_type: string;
  service_name: string;
  date: string;
  time: string;
  address: string;
  phone: string;
  special_instructions?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
  // Legacy fields for compatibility
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  service?: string;
  amount?: number;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  createdAt?: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
  duration_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
  updated_at: string;
}

export interface PickupDelivery {
  id: string;
  booking_id: string;
  user_id: string;
  type: 'pickup' | 'delivery';
  status: 'scheduled' | 'in_transit' | 'completed' | 'cancelled';
  pickup_address?: string;
  delivery_address?: string;
  scheduled_date: string;
  scheduled_time: string;
  actual_date?: string;
  actual_time?: string;
  driver_name?: string;
  driver_phone?: string;
  tracking_notes?: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceName?: string;
}

export interface UserComplaint {
  id: string;
  user_id: string;
  booking_id?: string;
  complaint_type: 'service_quality' | 'billing' | 'staff_behavior' | 'scheduling' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'investigating' | 'resolved' | 'closed';
  resolution_notes?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  // Computed fields
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

// New interfaces for enhanced admin features
export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: 'card' | 'cash' | 'bank_transfer' | 'digital_wallet';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_date: string;
  refund_amount?: number;
  refund_date?: string;
  refund_reason?: string;
  created_at: string;
  updated_at: string;
  // Additional fields for admin display
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly';
  billing_cycle: 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly';
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  start_date: string;
  end_date?: string;
  next_billing_date: string;
  amount: number;
  services_included: string[];
  max_services_per_period: number;
  used_services_current_period: number;
  auto_renewal: boolean;
  created_at: string;
  updated_at: string;
  // Additional fields for admin display
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface LaundryOrder {
  id: string;
  user_id: string;
  booking_id?: string;
  order_number: string;
  order_type: 'wash_fold' | 'dry_cleaning' | 'ironing' | 'special_care';
  service_type: 'wash_fold' | 'dry_cleaning' | 'ironing' | 'special_care';
  items: {
    item_type: string;
    quantity: number;
    special_instructions?: string;
    price_per_item: number;
  }[];
  item_count: number;
  pickup_date: string;
  delivery_date: string;
  status: 'received' | 'washing' | 'drying' | 'folding' | 'ready' | 'out_for_delivery' | 'delivered' | 'completed' | 'in_progress' | 'ready_for_pickup';
  total_amount: number;
  special_instructions?: string;
  quality_notes?: string;
  created_at: string;
  updated_at: string;
  // Additional fields for admin display
  customerName?: string;
  customer_name?: string;
  customerEmail?: string;
  customerPhone?: string;
  customer_phone?: string;
}

export interface AdminNotification {
  id: string;
  type: 'booking' | 'payment' | 'complaint' | 'system' | 'user_message';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  related_id?: string; // ID of related booking, payment, etc.
  action_required: boolean;
  created_at: string;
  read_at?: string;
}

export interface Review {
  id: string;
  user_id: string;
  booking_id: string;
  rating: number; // 1-5 stars
  title?: string;
  comment?: string;
  service_quality_rating: number;
  staff_rating: number;
  timeliness_rating: number;
  value_rating: number;
  would_recommend: boolean;
  status: 'pending' | 'approved' | 'rejected';
  admin_response?: string;
  created_at: string;
  updated_at: string;
  // Additional fields for admin display
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
}

export interface AppState {
  users: User[];
  bookings: Booking[];
  services: Service[];
  contactMessages: ContactMessage[];
  pickupDeliveries: PickupDelivery[];
  userComplaints: UserComplaint[];
  payments: Payment[];
  subscriptions: Subscription[];
  laundryOrders: LaundryOrder[];
  adminNotifications: AdminNotification[];
  reviews: Review[];
  currentUser: User | null;
  authUser: SupabaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  realTimeConnected: boolean;
  stats: {
    totalBookings: number;
    totalRevenue: number;
    activeUsers: number;
    pendingBookings: number;
    completedBookings: number;
    todayBookings: number;
    totalPayments: number;
    pendingPayments: number;
    activeSubscriptions: number;
    pendingOrders: number;
    unreadNotifications: number;
    averageRating: number;
    pendingReviews: number;
  };
}

// Actions
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AUTH_USER'; payload: SupabaseUser | null }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_BOOKINGS'; payload: Booking[] }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'UPDATE_BOOKING'; payload: { id: string; updates: Partial<Booking> } }
  | { type: 'DELETE_BOOKING'; payload: string }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'SET_CONTACT_MESSAGES'; payload: ContactMessage[] }
  | { type: 'ADD_CONTACT_MESSAGE'; payload: ContactMessage }
  | { type: 'UPDATE_CONTACT_MESSAGE'; payload: { id: string; updates: Partial<ContactMessage> } }
  | { type: 'SET_PICKUP_DELIVERIES'; payload: PickupDelivery[] }
  | { type: 'ADD_PICKUP_DELIVERY'; payload: PickupDelivery }
  | { type: 'UPDATE_PICKUP_DELIVERY'; payload: { id: string; updates: Partial<PickupDelivery> } }
  | { type: 'SET_USER_COMPLAINTS'; payload: UserComplaint[] }
  | { type: 'ADD_USER_COMPLAINT'; payload: UserComplaint }
  | { type: 'UPDATE_USER_COMPLAINT'; payload: { id: string; updates: Partial<UserComplaint> } }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: { id: string; updates: Partial<Payment> } }
  | { type: 'SET_SUBSCRIPTIONS'; payload: Subscription[] }
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: { id: string; updates: Partial<Subscription> } }
  | { type: 'SET_LAUNDRY_ORDERS'; payload: LaundryOrder[] }
  | { type: 'ADD_LAUNDRY_ORDER'; payload: LaundryOrder }
  | { type: 'UPDATE_LAUNDRY_ORDER'; payload: { id: string; updates: Partial<LaundryOrder> } }
  | { type: 'SET_ADMIN_NOTIFICATIONS'; payload: AdminNotification[] }
  | { type: 'ADD_ADMIN_NOTIFICATION'; payload: AdminNotification }
  | { type: 'UPDATE_ADMIN_NOTIFICATION'; payload: { id: string; updates: Partial<AdminNotification> } }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'UPDATE_REVIEW'; payload: { id: string; updates: Partial<Review> } }
  | { type: 'SET_REALTIME_CONNECTED'; payload: boolean }
  | { type: 'LOGIN'; payload: { authUser: SupabaseUser; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_STATS' };

const initialState: AppState = {
  users: [],
  bookings: [],
  services: [],
  contactMessages: [],
  pickupDeliveries: [],
  userComplaints: [],
  payments: [],
  subscriptions: [],
  laundryOrders: [],
  adminNotifications: [],
  reviews: [],
  currentUser: null,
  authUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  realTimeConnected: false,
  stats: {
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingBookings: 0,
    completedBookings: 0,
    todayBookings: 0,
    totalPayments: 0,
    pendingPayments: 0,
    activeSubscriptions: 0,
    pendingOrders: 0,
    unreadNotifications: 0,
    averageRating: 0,
    pendingReviews: 0
  }
};

// Reducer
function dataReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_AUTH_USER':
      return { 
        ...state, 
        authUser: action.payload,
        isAuthenticated: !!action.payload
      };

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };

    case 'SET_USERS':
      return { ...state, users: action.payload };

    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };

    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };

    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };

    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id
            ? { ...booking, ...action.payload.updates }
            : booking
        )
      };

    case 'DELETE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.payload)
      };

    case 'SET_SERVICES':
      return { ...state, services: action.payload };

    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };

    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id ? action.payload : service
        )
      };

    case 'SET_CONTACT_MESSAGES':
      return { ...state, contactMessages: action.payload };

    case 'ADD_CONTACT_MESSAGE':
      return { ...state, contactMessages: [...state.contactMessages, action.payload] };

    case 'UPDATE_CONTACT_MESSAGE':
      return {
        ...state,
        contactMessages: state.contactMessages.map(message =>
          message.id === action.payload.id
            ? { ...message, ...action.payload.updates }
            : message
        )
      };

    case 'SET_PICKUP_DELIVERIES':
      return { ...state, pickupDeliveries: action.payload };

    case 'ADD_PICKUP_DELIVERY':
      return { ...state, pickupDeliveries: [...state.pickupDeliveries, action.payload] };

    case 'UPDATE_PICKUP_DELIVERY':
      return {
        ...state,
        pickupDeliveries: state.pickupDeliveries.map(delivery =>
          delivery.id === action.payload.id
            ? { ...delivery, ...action.payload.updates }
            : delivery
        )
      };

    case 'SET_USER_COMPLAINTS':
      return { ...state, userComplaints: action.payload };

    case 'ADD_USER_COMPLAINT':
      return { ...state, userComplaints: [...state.userComplaints, action.payload] };

    case 'UPDATE_USER_COMPLAINT':
      return {
        ...state,
        userComplaints: state.userComplaints.map(complaint =>
          complaint.id === action.payload.id
            ? { ...complaint, ...action.payload.updates }
            : complaint
        )
      };

    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };

    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };

    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id
            ? { ...payment, ...action.payload.updates }
            : payment
        )
      };

    case 'SET_SUBSCRIPTIONS':
      return { ...state, subscriptions: action.payload };

    case 'ADD_SUBSCRIPTION':
      return { ...state, subscriptions: [...state.subscriptions, action.payload] };

    case 'UPDATE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map(subscription =>
          subscription.id === action.payload.id
            ? { ...subscription, ...action.payload.updates }
            : subscription
        )
      };

    case 'SET_LAUNDRY_ORDERS':
      return { ...state, laundryOrders: action.payload };

    case 'ADD_LAUNDRY_ORDER':
      return { ...state, laundryOrders: [...state.laundryOrders, action.payload] };

    case 'UPDATE_LAUNDRY_ORDER':
      return {
        ...state,
        laundryOrders: state.laundryOrders.map(order =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates }
            : order
        )
      };

    case 'SET_ADMIN_NOTIFICATIONS':
      return { ...state, adminNotifications: action.payload };

    case 'ADD_ADMIN_NOTIFICATION':
      return { ...state, adminNotifications: [...state.adminNotifications, action.payload] };

    case 'UPDATE_ADMIN_NOTIFICATION':
      return {
        ...state,
        adminNotifications: state.adminNotifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, ...action.payload.updates }
            : notification
        )
      };

    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload };

    case 'ADD_REVIEW':
      return { ...state, reviews: [...state.reviews, action.payload] };

    case 'UPDATE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload.id
            ? { ...review, ...action.payload.updates }
            : review
        )
      };

    case 'SET_REALTIME_CONNECTED':
      return { ...state, realTimeConnected: action.payload };

    case 'LOGIN':
      return {
        ...state,
        authUser: action.payload.authUser,
        currentUser: action.payload.user,
        isAuthenticated: true
      };

    case 'LOGOUT':
      return {
        ...state,
        authUser: null,
        currentUser: null,
        isAuthenticated: false
      };

    case 'UPDATE_STATS':
      const today = new Date().toISOString().split('T')[0];
      const totalRatings = state.reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = state.reviews.length > 0 ? totalRatings / state.reviews.length : 0;
      
      return {
        ...state,
        stats: {
          totalBookings: state.bookings.length,
          totalRevenue: state.bookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + b.total_amount, 0),
          activeUsers: state.users.length,
          pendingBookings: state.bookings.filter(b => b.status === 'pending').length,
          completedBookings: state.bookings.filter(b => b.status === 'completed').length,
          todayBookings: state.bookings.filter(b => b.date === today).length,
          totalPayments: state.payments.length,
          pendingPayments: state.payments.filter(p => p.payment_status === 'pending').length,
          activeSubscriptions: state.subscriptions.filter(s => s.status === 'active').length,
          pendingOrders: state.laundryOrders.filter(o => ['received', 'washing', 'drying', 'folding'].includes(o.status)).length,
          unreadNotifications: state.adminNotifications.filter(n => n.status === 'unread').length,
          averageRating: Math.round(averageRating * 10) / 10,
          pendingReviews: state.reviews.filter(r => r.status === 'pending').length
        }
      };

    default:
      return state;
  }
}

// Context
const SupabaseDataContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Supabase methods
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  createContactMessage: (message: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'status'>) => Promise<void>;
  fetchUserBookings: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchContactMessages: () => Promise<void>;
  updateContactMessage: (id: string, updates: Partial<ContactMessage>) => Promise<void>;
  // Admin methods
  fetchAllUsers: () => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  // Pickup/Delivery methods
  fetchPickupDeliveries: () => Promise<void>;
  createPickupDelivery: (delivery: Omit<PickupDelivery, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePickupDelivery: (id: string, updates: Partial<PickupDelivery>) => Promise<void>;
  // User Complaints methods
  fetchUserComplaints: () => Promise<void>;
  createUserComplaint: (complaint: Omit<UserComplaint, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateUserComplaint: (id: string, updates: Partial<UserComplaint>) => Promise<void>;
  // Payment methods
  fetchPayments: () => Promise<void>;
  createPayment: (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>;
  // Subscription methods
  fetchSubscriptions: () => Promise<void>;
  createSubscription: (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  // Laundry Order methods
  fetchLaundryOrders: () => Promise<void>;
  createLaundryOrder: (order: Omit<LaundryOrder, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateLaundryOrder: (id: string, updates: Partial<LaundryOrder>) => Promise<void>;
  // Admin Notification methods
  fetchAdminNotifications: () => Promise<void>;
  createAdminNotification: (notification: Omit<AdminNotification, 'id' | 'created_at'>) => Promise<void>;
  updateAdminNotification: (id: string, updates: Partial<AdminNotification>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  // Review methods
  fetchReviews: () => Promise<void>;
  updateReview: (id: string, updates: Partial<Review>) => Promise<void>;
  approveReview: (id: string, adminResponse?: string) => Promise<void>;
  rejectReview: (id: string, adminResponse?: string) => Promise<void>;
} | null>(null);

// Provider
export function SupabaseDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          dispatch({ type: 'SET_AUTH_USER', payload: session.user });
          
          // Fetch user profile
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userProfile) {
            dispatch({ type: 'SET_CURRENT_USER', payload: userProfile });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        dispatch({ type: 'SET_AUTH_USER', payload: session.user });
        
        // Fetch user profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userProfile) {
          dispatch({ type: 'SET_CURRENT_USER', payload: userProfile });
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set up real-time subscriptions for data synchronization
  useEffect(() => {
    const subscriptions: any[] = [];

    // Subscribe to bookings changes
    const bookingsSubscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          console.log('Bookings change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_BOOKING', payload: payload.new as Booking });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({ 
              type: 'UPDATE_BOOKING', 
              payload: { id: payload.new.id, updates: payload.new as Partial<Booking> }
            });
          } else if (payload.eventType === 'DELETE') {
            dispatch({ type: 'DELETE_BOOKING', payload: payload.old.id });
          }
        }
      )
      .subscribe();

    // Subscribe to contact messages changes
    const contactSubscription = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'contact_messages' },
        (payload) => {
          console.log('Contact messages change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_CONTACT_MESSAGE', payload: payload.new as ContactMessage });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'UPDATE_CONTACT_MESSAGE',
              payload: { id: payload.new.id, updates: payload.new as Partial<ContactMessage> }
            });
          }
        }
      )
      .subscribe();

    // Subscribe to users changes
    const usersSubscription = supabase
      .channel('users_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          console.log('Users change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_USER', payload: payload.new as User });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({ type: 'UPDATE_USER', payload: payload.new as User });
          }
        }
      )
      .subscribe();

    // Subscribe to pickup/delivery changes
    const pickupDeliverySubscription = supabase
      .channel('pickup_deliveries_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'pickup_deliveries' },
        (payload) => {
          console.log('Pickup/Delivery change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_PICKUP_DELIVERY', payload: payload.new as PickupDelivery });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'UPDATE_PICKUP_DELIVERY',
              payload: { id: payload.new.id, updates: payload.new as Partial<PickupDelivery> }
            });
          }
        }
      )
      .subscribe();

    // Subscribe to user complaints changes
    const complaintsSubscription = supabase
      .channel('user_complaints_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_complaints' },
        (payload) => {
          console.log('User complaints change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_USER_COMPLAINT', payload: payload.new as UserComplaint });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'UPDATE_USER_COMPLAINT',
              payload: { id: payload.new.id, updates: payload.new as Partial<UserComplaint> }
            });
          }
        }
      )
      .subscribe();

    // Subscribe to payments changes
    const paymentsSubscription = supabase
      .channel('payments_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          console.log('Payments change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_PAYMENT', payload: payload.new as Payment });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'UPDATE_PAYMENT',
              payload: { id: payload.new.id, updates: payload.new as Partial<Payment> }
            });
          }
        }
      )
      .subscribe();

    // Subscribe to subscriptions changes
    const subscriptionsSubscription = supabase
      .channel('subscriptions_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions' },
        (payload) => {
          console.log('Subscriptions change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_SUBSCRIPTION', payload: payload.new as Subscription });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'UPDATE_SUBSCRIPTION',
              payload: { id: payload.new.id, updates: payload.new as Partial<Subscription> }
            });
          }
        }
      )
      .subscribe();

    // Subscribe to laundry orders changes
    const laundryOrdersSubscription = supabase
      .channel('laundry_orders_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'laundry_orders' },
        (payload) => {
          console.log('Laundry orders change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_LAUNDRY_ORDER', payload: payload.new as LaundryOrder });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'UPDATE_LAUNDRY_ORDER',
              payload: { id: payload.new.id, updates: payload.new as Partial<LaundryOrder> }
            });
          }
        }
      )
      .subscribe();

    // Subscribe to admin notifications changes
    const notificationsSubscription = supabase
      .channel('admin_notifications_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'admin_notifications' },
        (payload) => {
          console.log('Admin notifications change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_ADMIN_NOTIFICATION', payload: payload.new as AdminNotification });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'UPDATE_ADMIN_NOTIFICATION',
              payload: { id: payload.new.id, updates: payload.new as Partial<AdminNotification> }
            });
          }
        }
      )
      .subscribe();

    // Subscribe to reviews changes
    const reviewsSubscription = supabase
      .channel('reviews_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        (payload) => {
          console.log('Reviews change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            dispatch({ type: 'ADD_REVIEW', payload: payload.new as Review });
          } else if (payload.eventType === 'UPDATE') {
            dispatch({
              type: 'UPDATE_REVIEW',
              payload: { id: payload.new.id, updates: payload.new as Partial<Review> }
            });
          }
        }
      )
      .subscribe();

    subscriptions.push(
      bookingsSubscription,
      contactSubscription,
      usersSubscription,
      pickupDeliverySubscription,
      complaintsSubscription,
      paymentsSubscription,
      subscriptionsSubscription,
      laundryOrdersSubscription,
      notificationsSubscription,
      reviewsSubscription
    );

    // Monitor connection status
    const connectionStatusInterval = setInterval(() => {
      const isConnected = subscriptions.every(sub => sub && sub.state === 'joined');
      dispatch({ type: 'SET_REALTIME_CONNECTED', payload: isConnected });
    }, 5000); // Check every 5 seconds

    // Set initial connection status
    setTimeout(() => {
      const isConnected = subscriptions.every(sub => sub && sub.state === 'joined');
      dispatch({ type: 'SET_REALTIME_CONNECTED', payload: isConnected });
    }, 2000); // Wait 2 seconds for initial connection

    // Cleanup subscriptions on unmount
    return () => {
      clearInterval(connectionStatusInterval);
      subscriptions.forEach(subscription => {
        if (subscription) {
          supabase.removeChannel(subscription);
        }
      });
    };
  }, []);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Update stats when data changes
  useEffect(() => {
    dispatch({ type: 'UPDATE_STATS' });
  }, [state.bookings, state.users]);

  // Auth methods
  const signUp = async (email: string, password: string, fullName: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // User profile will be created automatically via trigger
        dispatch({ type: 'SET_AUTH_USER', payload: data.user });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signIn = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        dispatch({ type: 'SET_AUTH_USER', payload: data.user });
        
        // Fetch user profile
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userProfile) {
          dispatch({ type: 'SET_CURRENT_USER', payload: userProfile });
        }
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signOut = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetPassword = async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Booking methods
  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    if (!state.authUser) throw new Error('User must be authenticated');

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          ...bookingData,
          user_id: state.authUser.id
        }])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_BOOKING', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_BOOKING', payload: { id, updates: data } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteBooking = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'DELETE_BOOKING', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Contact message method
  const createContactMessage = async (messageData: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          ...messageData,
          status: 'new'
        }])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_CONTACT_MESSAGE', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetch methods
  const fetchUserBookings = async () => {
    if (!state.authUser) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', state.authUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      dispatch({ type: 'SET_BOOKINGS', payload: data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      dispatch({ type: 'SET_SERVICES', payload: data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      dispatch({ type: 'SET_CONTACT_MESSAGES', payload: data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateContactMessage = async (id: string, updates: Partial<ContactMessage>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_CONTACT_MESSAGE', payload: { id, updates: data } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Admin methods
  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      dispatch({ type: 'SET_USERS', payload: data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const fetchAllBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          users!inner(
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include user information
      const transformedBookings = data?.map(booking => ({
        ...booking,
        userName: booking.users?.full_name || 'Unknown',
        userEmail: booking.users?.email || '',
        userPhone: booking.users?.phone || booking.phone
      })) || [];

      dispatch({ type: 'SET_BOOKINGS', payload: transformedBookings });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_USER', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteUser = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove user from local state
      dispatch({ type: 'SET_USERS', payload: state.users.filter(user => user.id !== id) });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Pickup/Delivery methods
  const fetchPickupDeliveries = async () => {
    try {
      const { data, error } = await supabase
        .from('pickup_deliveries')
        .select(`
          *,
          users!inner(
            full_name,
            email,
            phone
          ),
          bookings!inner(
            service_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include user and booking information
      const transformedDeliveries = data?.map(delivery => ({
        ...delivery,
        customerName: delivery.users?.full_name || 'Unknown',
        customerEmail: delivery.users?.email || '',
        customerPhone: delivery.users?.phone || '',
        serviceName: delivery.bookings?.service_name || 'Unknown Service'
      })) || [];

      dispatch({ type: 'SET_PICKUP_DELIVERIES', payload: transformedDeliveries });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createPickupDelivery = async (delivery: Omit<PickupDelivery, 'id' | 'created_at' | 'updated_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('pickup_deliveries')
        .insert([delivery])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_PICKUP_DELIVERY', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updatePickupDelivery = async (id: string, updates: Partial<PickupDelivery>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('pickup_deliveries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_PICKUP_DELIVERY', payload: { id, updates: data } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // User Complaints methods
  const fetchUserComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('user_complaints')
        .select(`
          *,
          users!inner(
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include user information
      const transformedComplaints = data?.map(complaint => ({
        ...complaint,
        customerName: complaint.users?.full_name || 'Unknown',
        customerEmail: complaint.users?.email || '',
        customerPhone: complaint.users?.phone || ''
      })) || [];

      dispatch({ type: 'SET_USER_COMPLAINTS', payload: transformedComplaints });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createUserComplaint = async (complaint: Omit<UserComplaint, 'id' | 'created_at' | 'updated_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('user_complaints')
        .insert([complaint])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_USER_COMPLAINT', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUserComplaint = async (id: string, updates: Partial<UserComplaint>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('user_complaints')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_USER_COMPLAINT', payload: { id, updates: data } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Payment methods
  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          users!inner(
            full_name,
            email
          ),
          bookings!inner(
            service_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPayments = data?.map(payment => ({
        ...payment,
        customerName: payment.users?.full_name || 'Unknown',
        customerEmail: payment.users?.email || '',
        serviceName: payment.bookings?.service_name || 'Unknown Service'
      })) || [];

      dispatch({ type: 'SET_PAYMENTS', payload: transformedPayments });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([payment])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_PAYMENT', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_PAYMENT', payload: { id, updates: data } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Subscription methods
  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          users!inner(
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedSubscriptions = data?.map(subscription => ({
        ...subscription,
        customerName: subscription.users?.full_name || 'Unknown',
        customerEmail: subscription.users?.email || '',
        customerPhone: subscription.users?.phone || ''
      })) || [];

      dispatch({ type: 'SET_SUBSCRIPTIONS', payload: transformedSubscriptions });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createSubscription = async (subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscription])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_SUBSCRIPTION', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: { id, updates: data } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Laundry Order methods
  const fetchLaundryOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('laundry_orders')
        .select(`
          *,
          users!inner(
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOrders = data?.map(order => ({
        ...order,
        customerName: order.users?.full_name || 'Unknown',
        customerEmail: order.users?.email || '',
        customerPhone: order.users?.phone || ''
      })) || [];

      dispatch({ type: 'SET_LAUNDRY_ORDERS', payload: transformedOrders });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createLaundryOrder = async (order: Omit<LaundryOrder, 'id' | 'created_at' | 'updated_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('laundry_orders')
        .insert([order])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_LAUNDRY_ORDER', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateLaundryOrder = async (id: string, updates: Partial<LaundryOrder>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('laundry_orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_LAUNDRY_ORDER', payload: { id, updates: data } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Admin Notification methods
  const fetchAdminNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      dispatch({ type: 'SET_ADMIN_NOTIFICATIONS', payload: data || [] });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createAdminNotification = async (notification: Omit<AdminNotification, 'id' | 'created_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .insert([notification])
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_ADMIN_NOTIFICATION', payload: data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateAdminNotification = async (id: string, updates: Partial<AdminNotification>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_ADMIN_NOTIFICATION', payload: { id, updates: data } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markNotificationAsRead = async (id: string) => {
    await updateAdminNotification(id, { 
      status: 'read', 
      read_at: new Date().toISOString() 
    });
  };

  // Review methods
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users!inner(
            full_name,
            email
          ),
          bookings!inner(
            service_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedReviews = data?.map(review => ({
        ...review,
        customerName: review.users?.full_name || 'Unknown',
        customerEmail: review.users?.email || '',
        serviceName: review.bookings?.service_name || 'Unknown Service'
      })) || [];

      dispatch({ type: 'SET_REVIEWS', payload: transformedReviews });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateReview = async (id: string, updates: Partial<Review>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      dispatch({ type: 'UPDATE_REVIEW', payload: { id, updates: data } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const approveReview = async (id: string, adminResponse?: string) => {
    await updateReview(id, { 
      status: 'approved', 
      admin_response: adminResponse 
    });
  };

  const rejectReview = async (id: string, adminResponse?: string) => {
    await updateReview(id, { 
      status: 'rejected', 
      admin_response: adminResponse 
    });
  };

  return (
    <SupabaseDataContext.Provider value={{
      state,
      dispatch,
      signUp,
      signIn,
      signOut,
      resetPassword,
      createBooking,
      updateBooking,
      deleteBooking,
      createContactMessage,
      fetchUserBookings,
      fetchServices,
      fetchContactMessages,
      updateContactMessage,
      fetchAllUsers,
      fetchAllBookings,
      updateUser,
      deleteUser,
      fetchPickupDeliveries,
      createPickupDelivery,
      updatePickupDelivery,
      fetchUserComplaints,
      createUserComplaint,
      updateUserComplaint,
      fetchPayments,
      createPayment,
      updatePayment,
      fetchSubscriptions,
      createSubscription,
      updateSubscription,
      fetchLaundryOrders,
      createLaundryOrder,
      updateLaundryOrder,
      fetchAdminNotifications,
      createAdminNotification,
      updateAdminNotification,
      markNotificationAsRead,
      fetchReviews,
      updateReview,
      approveReview,
      rejectReview
    }}>
      {children}
    </SupabaseDataContext.Provider>
  );
}

// Hook
export function useSupabaseData() {
  const context = useContext(SupabaseDataContext);
  if (!context) {
    throw new Error('useSupabaseData must be used within a SupabaseDataProvider');
  }
  return context;
}

// Helper functions (keeping for compatibility)
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}