export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      gsc_pages: {
        Row: {
          clicks: number | null
          ctr: number | null
          date: string
          impressions: number | null
          page_url: string
          position: number | null
        }
        Insert: {
          clicks?: number | null
          ctr?: number | null
          date: string
          impressions?: number | null
          page_url: string
          position?: number | null
        }
        Update: {
          clicks?: number | null
          ctr?: number | null
          date?: string
          impressions?: number | null
          page_url?: string
          position?: number | null
        }
        Relationships: []
      }
      gsc_queries: {
        Row: {
          clicks: number | null
          ctr: number | null
          date: string
          impressions: number | null
          page_url: string
          position: number | null
          query: string
        }
        Insert: {
          clicks?: number | null
          ctr?: number | null
          date: string
          impressions?: number | null
          page_url: string
          position?: number | null
          query: string
        }
        Update: {
          clicks?: number | null
          ctr?: number | null
          date?: string
          impressions?: number | null
          page_url?: string
          position?: number | null
          query?: string
        }
        Relationships: []
      }
      keywords: {
        Row: {
          cpc: number | null
          kd: number | null
          keyword: string
          language: string | null
          location: string | null
          source: string | null
          updated_at: string | null
          volume: number | null
        }
        Insert: {
          cpc?: number | null
          kd?: number | null
          keyword: string
          language?: string | null
          location?: string | null
          source?: string | null
          updated_at?: string | null
          volume?: number | null
        }
        Update: {
          cpc?: number | null
          kd?: number | null
          keyword?: string
          language?: string | null
          location?: string | null
          source?: string | null
          updated_at?: string | null
          volume?: number | null
        }
        Relationships: []
      }
      links: {
        Row: {
          created_at: string | null
          source_url: string
          target_url: string
        }
        Insert: {
          created_at?: string | null
          source_url: string
          target_url: string
        }
        Update: {
          created_at?: string | null
          source_url?: string
          target_url?: string
        }
        Relationships: []
      }
      oauth_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string | null
          id: number
          provider: string
          refresh_token: string | null
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at?: string | null
          id?: number
          provider?: string
          refresh_token?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string | null
          id?: number
          provider?: string
          refresh_token?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          anchor: string
          created_at: string | null
          id: number
          keyword: string
          kw_score: number
          page_score: number
          priority: number
          source_url: string
          status: string | null
          target_url: string
          updated_at: string | null
        }
        Insert: {
          anchor: string
          created_at?: string | null
          id?: number
          keyword: string
          kw_score?: number
          page_score?: number
          priority?: number
          source_url: string
          status?: string | null
          target_url: string
          updated_at?: string | null
        }
        Update: {
          anchor?: string
          created_at?: string | null
          id?: number
          keyword?: string
          kw_score?: number
          page_score?: number
          priority?: number
          source_url?: string
          status?: string | null
          target_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      page_tokens: {
        Row: {
          bm25: number | null
          created_at: string | null
          page_id: number
          positions: number[] | null
          tf: number | null
          tfidf: number | null
          token_id: number
        }
        Insert: {
          bm25?: number | null
          created_at?: string | null
          page_id: number
          positions?: number[] | null
          tf?: number | null
          tfidf?: number | null
          token_id: number
        }
        Update: {
          bm25?: number | null
          created_at?: string | null
          page_id?: number
          positions?: number[] | null
          tf?: number | null
          tfidf?: number | null
          token_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "page_tokens_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_tokens_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content_hash: string | null
          created_at: string | null
          id: number
          incoming_count: number | null
          last_crawled_at: string | null
          outgoing_count: number | null
          title: string | null
          url: string
        }
        Insert: {
          content_hash?: string | null
          created_at?: string | null
          id?: number
          incoming_count?: number | null
          last_crawled_at?: string | null
          outgoing_count?: number | null
          title?: string | null
          url: string
        }
        Update: {
          content_hash?: string | null
          created_at?: string | null
          id?: number
          incoming_count?: number | null
          last_crawled_at?: string | null
          outgoing_count?: number | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          created_at: string | null
          df: number | null
          id: number
          is_ngram: boolean | null
          stem: string | null
          token: string
        }
        Insert: {
          created_at?: string | null
          df?: number | null
          id?: number
          is_ngram?: boolean | null
          stem?: string | null
          token: string
        }
        Update: {
          created_at?: string | null
          df?: number | null
          id?: number
          is_ngram?: boolean | null
          stem?: string | null
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
