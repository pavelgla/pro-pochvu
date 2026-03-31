export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      product_lines: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand: string;
          description: string | null;
          image: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          brand: string;
          description?: string | null;
          image?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          brand?: string;
          description?: string | null;
          image?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          parent_id: string | null;
          product_line_id: string | null;
          description: string | null;
          image: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          parent_id?: string | null;
          product_line_id?: string | null;
          description?: string | null;
          image?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          parent_id?: string | null;
          product_line_id?: string | null;
          description?: string | null;
          image?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          short_description: string | null;
          price: number;
          price_old: number | null;
          discount_percent: number | null;
          brand: string;
          product_line_id: string;
          category_id: string | null;
          images: string[];
          video_url: string | null;
          characteristics: Json;
          variants: Json;
          weight_grams: number;
          dimensions: Json | null;
          stock: number;
          badge: string | null;
          rating: number;
          reviews_count: number;
          marketplace_ids: Json;
          seo_title: string | null;
          seo_description: string | null;
          seo_og_image: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          short_description?: string | null;
          price: number;
          price_old?: number | null;
          discount_percent?: number | null;
          brand: string;
          product_line_id: string;
          category_id?: string | null;
          images?: string[];
          video_url?: string | null;
          characteristics?: Json;
          variants?: Json;
          weight_grams?: number;
          dimensions?: Json | null;
          stock?: number;
          badge?: string | null;
          rating?: number;
          reviews_count?: number;
          marketplace_ids?: Json;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          short_description?: string | null;
          price?: number;
          price_old?: number | null;
          discount_percent?: number | null;
          brand?: string;
          product_line_id?: string;
          category_id?: string | null;
          images?: string[];
          video_url?: string | null;
          characteristics?: Json;
          variants?: Json;
          weight_grams?: number;
          dimensions?: Json | null;
          stock?: number;
          badge?: string | null;
          rating?: number;
          reviews_count?: number;
          marketplace_ids?: Json;
          seo_title?: string | null;
          seo_description?: string | null;
          seo_og_image?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: number;
          user_id: string | null;
          channel: string;
          status: string;
          total: number;
          subtotal: number;
          delivery_cost: number;
          discount: number;
          promo_code: string | null;
          delivery_provider: string | null;
          delivery_method: string | null;
          delivery_address: Json | null;
          delivery_city_code: number | null;
          delivery_order_id: string | null;
          delivery_track: string | null;
          delivery_status: string | null;
          delivery_provider_track: string | null;
          payment_method: string | null;
          payment_id: string | null;
          payment_status: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: number;
          user_id?: string | null;
          channel?: string;
          status?: string;
          total: number;
          subtotal: number;
          delivery_cost?: number;
          discount?: number;
          promo_code?: string | null;
          delivery_provider?: string | null;
          delivery_method?: string | null;
          delivery_address?: Json | null;
          delivery_city_code?: number | null;
          delivery_order_id?: string | null;
          delivery_track?: string | null;
          delivery_status?: string | null;
          delivery_provider_track?: string | null;
          payment_method?: string | null;
          payment_id?: string | null;
          payment_status?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: number;
          user_id?: string | null;
          channel?: string;
          status?: string;
          total?: number;
          subtotal?: number;
          delivery_cost?: number;
          discount?: number;
          promo_code?: string | null;
          delivery_provider?: string | null;
          delivery_method?: string | null;
          delivery_address?: Json | null;
          delivery_city_code?: number | null;
          delivery_order_id?: string | null;
          delivery_track?: string | null;
          delivery_status?: string | null;
          delivery_provider_track?: string | null;
          payment_method?: string | null;
          payment_id?: string | null;
          payment_status?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          customer_comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          price: number;
          name: string;
          image: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity: number;
          price: number;
          name: string;
          image?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          price?: number;
          name?: string;
          image?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          phone: string | null;
          addresses: Json;
          loyalty_points: number;
          referral_code: string | null;
          referred_by: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          phone?: string | null;
          addresses?: Json;
          loyalty_points?: number;
          referral_code?: string | null;
          referred_by?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          phone?: string | null;
          addresses?: Json;
          loyalty_points?: number;
          referral_code?: string | null;
          referred_by?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          discount_type: string;
          discount_value: number;
          min_order_amount: number;
          valid_from: string;
          valid_until: string | null;
          uses_limit: number | null;
          uses_count: number;
          applicable_brands: string[] | null;
          applicable_product_lines: string[] | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: string;
          discount_value: number;
          min_order_amount?: number;
          valid_from?: string;
          valid_until?: string | null;
          uses_limit?: number | null;
          uses_count?: number;
          applicable_brands?: string[] | null;
          applicable_product_lines?: string[] | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: string;
          discount_value?: number;
          min_order_amount?: number;
          valid_from?: string;
          valid_until?: string | null;
          uses_limit?: number | null;
          uses_count?: number;
          applicable_brands?: string[] | null;
          applicable_product_lines?: string[] | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          source: string;
          source_id: string | null;
          rating: number;
          author_name: string | null;
          text: string | null;
          images: string[] | null;
          is_verified: boolean;
          is_visible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          source?: string;
          source_id?: string | null;
          rating: number;
          author_name?: string | null;
          text?: string | null;
          images?: string[] | null;
          is_verified?: boolean;
          is_visible?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string | null;
          source?: string;
          source_id?: string | null;
          rating?: number;
          author_name?: string | null;
          text?: string | null;
          images?: string[] | null;
          is_verified?: boolean;
          is_visible?: boolean;
          created_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          excerpt: string | null;
          category: string | null;
          tags: string[] | null;
          cover_image: string | null;
          seo_title: string | null;
          seo_description: string | null;
          author: string;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content: string;
          excerpt?: string | null;
          category?: string | null;
          tags?: string[] | null;
          cover_image?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          author?: string;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: string;
          excerpt?: string | null;
          category?: string | null;
          tags?: string[] | null;
          cover_image?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          author?: string;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      knowledge_base: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          type: string;
          product_ids: string[] | null;
          category: string | null;
          cover_image: string | null;
          video_url: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content: string;
          type: string;
          product_ids?: string[] | null;
          category?: string | null;
          cover_image?: string | null;
          video_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: string;
          type?: string;
          product_ids?: string[] | null;
          category?: string | null;
          cover_image?: string | null;
          video_url?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          status: string;
          interval_months: number;
          next_delivery: string | null;
          last_payment_id: string | null;
          pause_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity?: number;
          status?: string;
          interval_months?: number;
          next_delivery?: string | null;
          last_payment_id?: string | null;
          pause_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          status?: string;
          interval_months?: number;
          next_delivery?: string | null;
          last_payment_id?: string | null;
          pause_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          title: string;
          message: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: string;
          title: string;
          message: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          type?: string;
          title?: string;
          message?: string;
          data?: Json | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      sync_log: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          channel: string;
          action: string;
          status: string;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id: string;
          channel: string;
          action: string;
          status: string;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          entity_type?: string;
          entity_id?: string;
          channel?: string;
          action?: string;
          status?: string;
          error_message?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
};

// Convenience types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Shorthand aliases
export type ProductLine = Tables<"product_lines">;
export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type Profile = Tables<"profiles">;
export type PromoCode = Tables<"promo_codes">;
export type Review = Tables<"reviews">;
export type BlogPost = Tables<"blog_posts">;
export type KnowledgeBaseArticle = Tables<"knowledge_base">;
export type Favorite = Tables<"favorites">;
export type Subscription = Tables<"subscriptions">;
export type Notification = Tables<"notifications">;
export type SyncLogEntry = Tables<"sync_log">;
