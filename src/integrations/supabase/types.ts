export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      escalas: {
        Row: {
          colaborador_id: string
          created_at: string
          domingo: string | null
          id: string
          quarta: string | null
          quinta: string | null
          sabado: string | null
          segunda: string | null
          semana: string
          sexta: string | null
          terca: string | null
          updated_at: string
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          domingo?: string | null
          id?: string
          quarta?: string | null
          quinta?: string | null
          sabado?: string | null
          segunda?: string | null
          semana: string
          sexta?: string | null
          terca?: string | null
          updated_at?: string
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          domingo?: string | null
          id?: string
          quarta?: string | null
          quinta?: string | null
          sabado?: string | null
          segunda?: string | null
          semana?: string
          sexta?: string | null
          terca?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalas_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ponto_registros: {
        Row: {
          colaborador_id: string
          created_at: string
          data: string
          entrada: string | null
          horas_liquidas: number | null
          id: string
          retorno_almoco: string | null
          saida: string | null
          saida_almoco: string | null
          updated_at: string
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          data?: string
          entrada?: string | null
          horas_liquidas?: number | null
          id?: string
          retorno_almoco?: string | null
          saida?: string | null
          saida_almoco?: string | null
          updated_at?: string
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          data?: string
          entrada?: string | null
          horas_liquidas?: number | null
          id?: string
          retorno_almoco?: string | null
          saida?: string | null
          saida_almoco?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ponto_registros_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          must_change_password: boolean | null
          password_expires_at: string | null
          payment_status: string | null
          stripe_customer_id: string | null
          stripe_session_id: string | null
          subscription_type: string
          temporary_password: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          must_change_password?: boolean | null
          password_expires_at?: string | null
          payment_status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          subscription_type: string
          temporary_password?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          must_change_password?: boolean | null
          password_expires_at?: string | null
          payment_status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          subscription_type?: string
          temporary_password?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          cargo: string
          cpf: string
          created_at: string
          email: string
          id: string
          nome: string
          senha: string
          tipo: string
          updated_at: string
        }
        Insert: {
          cargo: string
          cpf: string
          created_at?: string
          email: string
          id?: string
          nome: string
          senha: string
          tipo: string
          updated_at?: string
        }
        Update: {
          cargo?: string
          cpf?: string
          created_at?: string
          email?: string
          id?: string
          nome?: string
          senha?: string
          tipo?: string
          updated_at?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
