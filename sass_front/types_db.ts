export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          price_id: string | null
          quantity: number | null
          cancel_at_period_end: boolean | null
          created: string
          current_period_start: string
          current_period_end: string
          ended_at: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          metadata: Json | null
        }
        Insert: {
          id: string
          user_id: string
          status: string
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          created?: string
          current_period_start?: string
          current_period_end?: string
          ended_at?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          metadata?: Json | null
        }
      }
      prices: {
        Row: {
          id: string
          product_id: string
          active: boolean
          description: string | null
          unit_amount: number | null
          currency: string | null
          type: string | null
          interval: string | null
          interval_count: number | null
          trial_period_days: number | null
          metadata: Json | null
        }
        Insert: {
          id: string
          product_id: string
          active?: boolean
          description?: string | null
          unit_amount?: number | null
          currency?: string | null
          type?: string | null
          interval?: string | null
          interval_count?: number | null
          trial_period_days?: number | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          product_id?: string
          active?: boolean
          description?: string | null
          unit_amount?: number | null
          currency?: string | null
          type?: string | null
          interval?: string | null
          interval_count?: number | null
          trial_period_days?: number | null
          metadata?: Json | null
        }
      }
      products: {
        Row: {
          id: string
          active: boolean
          name: string
          description: string | null
          image: string | null
          metadata: Json | null
        }
        Insert: {
          id: string
          active?: boolean
          name: string
          description?: string | null
          image?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          active?: boolean
          name?: string
          description?: string | null
          image?: string | null
          metadata?: Json | null
        }
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          billing_address: Json | null
          payment_method: Json | null
        }
        Insert: {
          id: string
          email: string
          billing_address?: Json | null
          payment_method?: Json | null
        }
        Update: {
          id?: string
          email?: string
          billing_address?: Json | null
          payment_method?: Json | null
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
