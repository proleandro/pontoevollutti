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
      assinaturas: {
        Row: {
          cliente_id: string
          created_at: string
          data_fim: string
          data_inicio: string
          data_pagamento: string | null
          id: string
          plano_id: string
          status: string
          updated_at: string
          valor_pago: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_fim: string
          data_inicio: string
          data_pagamento?: string | null
          id?: string
          plano_id: string
          status?: string
          updated_at?: string
          valor_pago: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_fim?: string
          data_inicio?: string
          data_pagamento?: string | null
          id?: string
          plano_id?: string
          status?: string
          updated_at?: string
          valor_pago?: number
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          created_at: string
          data_ultimo_pagamento: string | null
          email: string
          id: string
          nome: string
          observacoes: string | null
          plano_ativo_id: string | null
          status_assinatura: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_ultimo_pagamento?: string | null
          email: string
          id?: string
          nome: string
          observacoes?: string | null
          plano_ativo_id?: string | null
          status_assinatura?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_ultimo_pagamento?: string | null
          email?: string
          id?: string
          nome?: string
          observacoes?: string | null
          plano_ativo_id?: string | null
          status_assinatura?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_plano_ativo_id_fkey"
            columns: ["plano_ativo_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_requests: {
        Row: {
          created_at: string
          id: string
          requested_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          requested_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          requested_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_requests_requested_id_fkey"
            columns: ["requested_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          created_at: string
          id: string
          requested_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          requested_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          requested_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_requested_id_fkey"
            columns: ["requested_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_deleted: boolean | null
          last_message_at: string | null
          participant1_id: string
          participant2_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          last_message_at?: string | null
          participant1_id: string
          participant2_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          last_message_at?: string | null
          participant1_id?: string
          participant2_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      escalas: {
        Row: {
          colaborador_id: string
          created_at: string
          domingo_entrada: string | null
          domingo_saida: string | null
          id: string
          quarta_entrada: string | null
          quarta_saida: string | null
          quinta_entrada: string | null
          quinta_saida: string | null
          sabado_entrada: string | null
          sabado_saida: string | null
          segunda_entrada: string | null
          segunda_saida: string | null
          semana: string
          sexta_entrada: string | null
          sexta_saida: string | null
          terca_entrada: string | null
          terca_saida: string | null
          updated_at: string
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          domingo_entrada?: string | null
          domingo_saida?: string | null
          id?: string
          quarta_entrada?: string | null
          quarta_saida?: string | null
          quinta_entrada?: string | null
          quinta_saida?: string | null
          sabado_entrada?: string | null
          sabado_saida?: string | null
          segunda_entrada?: string | null
          segunda_saida?: string | null
          semana: string
          sexta_entrada?: string | null
          sexta_saida?: string | null
          terca_entrada?: string | null
          terca_saida?: string | null
          updated_at?: string
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          domingo_entrada?: string | null
          domingo_saida?: string | null
          id?: string
          quarta_entrada?: string | null
          quarta_saida?: string | null
          quinta_entrada?: string | null
          quinta_saida?: string | null
          sabado_entrada?: string | null
          sabado_saida?: string | null
          segunda_entrada?: string | null
          segunda_saida?: string | null
          semana?: string
          sexta_entrada?: string | null
          sexta_saida?: string | null
          terca_entrada?: string | null
          terca_saida?: string | null
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
      event_interests: {
        Row: {
          created_at: string
          event_id: string
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          profile_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_interests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_interests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          age_restriction: number | null
          capacity: number | null
          cover_image: string | null
          created_at: string
          description: string | null
          dj_lineup: string[] | null
          dress_code: string | null
          end_time: string | null
          event_date: string
          gallery_images: string[] | null
          id: string
          is_active: boolean
          is_featured: boolean | null
          music_style: string | null
          nightclub_id: string | null
          start_time: string | null
          ticket_link: string | null
          ticket_price: number | null
          title: string
          updated_at: string
        }
        Insert: {
          age_restriction?: number | null
          capacity?: number | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          dj_lineup?: string[] | null
          dress_code?: string | null
          end_time?: string | null
          event_date: string
          gallery_images?: string[] | null
          id?: string
          is_active?: boolean
          is_featured?: boolean | null
          music_style?: string | null
          nightclub_id?: string | null
          start_time?: string | null
          ticket_link?: string | null
          ticket_price?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          age_restriction?: number | null
          capacity?: number | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          dj_lineup?: string[] | null
          dress_code?: string | null
          end_time?: string | null
          event_date?: string
          gallery_images?: string[] | null
          id?: string
          is_active?: boolean
          is_featured?: boolean | null
          music_style?: string | null
          nightclub_id?: string | null
          start_time?: string | null
          ticket_link?: string | null
          ticket_price?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_nightclub_id_fkey"
            columns: ["nightclub_id"]
            isOneToOne: false
            referencedRelation: "nightclubs"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string | null
          id: string
          invitation_token: string
          invitee_email: string
          inviter_id: string
          used: boolean | null
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitation_token?: string
          invitee_email: string
          inviter_id: string
          used?: boolean | null
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_token?: string
          invitee_email?: string
          inviter_id?: string
          used?: boolean | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          profile_id: string
          reaction_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          profile_id: string
          reaction_type: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          profile_id?: string
          reaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          connection_id: string | null
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          media_type: string | null
          media_url: string | null
          message_type: string | null
          sender_id: string
        }
        Insert: {
          connection_id?: string | null
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          media_type?: string | null
          media_url?: string | null
          message_type?: string | null
          sender_id: string
        }
        Update: {
          connection_id?: string | null
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          media_type?: string | null
          media_url?: string | null
          message_type?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nightclubs: {
        Row: {
          address: string
          age_restriction: number | null
          amenities: string[] | null
          average_price_range: string | null
          capacity: number | null
          city: string
          cover_image: string | null
          created_at: string
          description: string | null
          dress_code: string | null
          gallery_images: string[] | null
          id: string
          instagram: string | null
          is_active: boolean
          music_styles: string[] | null
          name: string
          phone: string | null
          state: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          age_restriction?: number | null
          amenities?: string[] | null
          average_price_range?: string | null
          capacity?: number | null
          city: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          dress_code?: string | null
          gallery_images?: string[] | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          music_styles?: string[] | null
          name: string
          phone?: string | null
          state: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          age_restriction?: number | null
          amenities?: string[] | null
          average_price_range?: string | null
          capacity?: number | null
          city?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          dress_code?: string | null
          gallery_images?: string[] | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          music_styles?: string[] | null
          name?: string
          phone?: string | null
          state?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          profile_id: string
          related_post_id: string | null
          related_profile_id: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          profile_id: string
          related_post_id?: string | null
          related_profile_id?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          profile_id?: string
          related_post_id?: string | null
          related_profile_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_aggregates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_profile_id_fkey"
            columns: ["related_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          assinatura_id: string | null
          cliente_id: string
          created_at: string
          data_pagamento: string
          id: string
          metodo_pagamento: string
          observacoes: string | null
          status_pagamento: string
          updated_at: string
          valor: number
        }
        Insert: {
          assinatura_id?: string | null
          cliente_id: string
          created_at?: string
          data_pagamento?: string
          id?: string
          metodo_pagamento: string
          observacoes?: string | null
          status_pagamento?: string
          updated_at?: string
          valor: number
        }
        Update: {
          assinatura_id?: string | null
          cliente_id?: string
          created_at?: string
          data_pagamento?: string
          id?: string
          metodo_pagamento?: string
          observacoes?: string | null
          status_pagamento?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_assinatura_id_fkey"
            columns: ["assinatura_id"]
            isOneToOne: false
            referencedRelation: "assinaturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean | null
          beneficios: Json | null
          created_at: string
          descricao: string | null
          duracao_em_dias: number
          id: string
          nome_do_plano: string
          recorrente: boolean | null
          updated_at: string
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          beneficios?: Json | null
          created_at?: string
          descricao?: string | null
          duracao_em_dias: number
          id?: string
          nome_do_plano: string
          recorrente?: boolean | null
          updated_at?: string
          valor: number
        }
        Update: {
          ativo?: boolean | null
          beneficios?: Json | null
          created_at?: string
          descricao?: string | null
          duracao_em_dias?: number
          id?: string
          nome_do_plano?: string
          recorrente?: boolean | null
          updated_at?: string
          valor?: number
        }
        Relationships: []
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
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_aggregates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          profile_id: string
          reaction_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          profile_id: string
          reaction_type: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          profile_id?: string
          reaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_with_aggregates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          media_type: string | null
          media_url: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_media: {
        Row: {
          created_at: string
          id: string
          is_cover: boolean | null
          media_type: string
          media_url: string
          order_index: number | null
          profile_id: string
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_cover?: boolean | null
          media_type: string
          media_url: string
          order_index?: number | null
          profile_id: string
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_cover?: boolean | null
          media_type?: string
          media_url?: string
          order_index?: number | null
          profile_id?: string
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_media_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number
          category: string
          city: string
          connection_count: number | null
          cover_photo: string | null
          created_at: string
          description: string | null
          engagement_score: number | null
          gender: string
          id: string
          interests: string[] | null
          invited_by_matricula: string | null
          is_active: boolean | null
          is_verified: boolean | null
          is_vip: boolean | null
          last_active: string | null
          location: string
          matricula_code: string
          message_count: number | null
          neighborhood: string | null
          nickname: string
          partner_age: number | null
          partner_name: string | null
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age: number
          category: string
          city: string
          connection_count?: number | null
          cover_photo?: string | null
          created_at?: string
          description?: string | null
          engagement_score?: number | null
          gender: string
          id?: string
          interests?: string[] | null
          invited_by_matricula?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          is_vip?: boolean | null
          last_active?: string | null
          location: string
          matricula_code: string
          message_count?: number | null
          neighborhood?: string | null
          nickname: string
          partner_age?: number | null
          partner_name?: string | null
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          category?: string
          city?: string
          connection_count?: number | null
          cover_photo?: string | null
          created_at?: string
          description?: string | null
          engagement_score?: number | null
          gender?: string
          id?: string
          interests?: string[] | null
          invited_by_matricula?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          is_vip?: boolean | null
          last_active?: string | null
          location?: string
          matricula_code?: string
          message_count?: number | null
          neighborhood?: string | null
          nickname?: string
          partner_age?: number | null
          partner_name?: string | null
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_status: {
        Row: {
          created_at: string
          id: string
          is_online: boolean | null
          is_typing_in_conversation: string | null
          last_seen: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_online?: boolean | null
          is_typing_in_conversation?: string | null
          last_seen?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_online?: boolean | null
          is_typing_in_conversation?: string | null
          last_seen?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_status_is_typing_in_conversation_fkey"
            columns: ["is_typing_in_conversation"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_status_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      posts_with_aggregates: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          media_type: string | null
          media_url: string | null
          profile_id: string | null
          reactions: Json | null
          total_reactions: number | null
          updated_at: string | null
        }
        Insert: {
          comments_count?: never
          content?: string | null
          created_at?: string | null
          id?: string | null
          media_type?: string | null
          media_url?: string | null
          profile_id?: string | null
          reactions?: never
          total_reactions?: never
          updated_at?: string | null
        }
        Update: {
          comments_count?: never
          content?: string | null
          created_at?: string | null
          id?: string | null
          media_type?: string | null
          media_url?: string | null
          profile_id?: string | null
          reactions?: never
          total_reactions?: never
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calcular_status_assinatura: {
        Args: { data_fim: string }
        Returns: string
      }
      create_notification: {
        Args: {
          target_profile_id: string
          notification_type: string
          notification_title: string
          notification_message: string
          post_id?: string
          from_profile_id?: string
        }
        Returns: string
      }
      generate_matricula_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_or_create_conversation: {
        Args: { p1_id: string; p2_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "user"
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
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
