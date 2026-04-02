// Auto-generated types placeholder
// Run: pnpm supabase gen types typescript --local > src/types/supabase.ts
// after connecting to Supabase

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
      outlets: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          brand_color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          brand_color: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          brand_color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          outlet_id: string
          full_name: string
          avatar_url: string | null
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          outlet_id: string
          full_name: string
          avatar_url?: string | null
          role: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          outlet_id?: string
          full_name?: string
          avatar_url?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_outlet_id_fkey'
            columns: ['outlet_id']
            isOneToOne: false
            referencedRelation: 'outlets'
            referencedColumns: ['id']
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          outlet_id: string
          category: string
          title: string
          description: string | null
          status: string
          priority: string
          assigned_to: string | null
          created_by: string
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          outlet_id: string
          category: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          created_by: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          outlet_id?: string
          category?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          assigned_to?: string | null
          created_by?: string
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tasks_outlet_id_fkey'
            columns: ['outlet_id']
            isOneToOne: false
            referencedRelation: 'outlets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_assigned_to_fkey'
            columns: ['assigned_to']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      task_step_logs: {
        Row: {
          id: string
          task_id: string
          step_code: string
          step_name: string
          step_order: number
          progress_weight: number
          is_final: boolean
          status: string
          completed_by: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          step_code: string
          step_name: string
          step_order: number
          progress_weight: number
          is_final?: boolean
          status?: string
          completed_by?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          step_code?: string
          step_name?: string
          step_order?: number
          progress_weight?: number
          is_final?: boolean
          status?: string
          completed_by?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_step_logs_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          related_task_id: string | null
          is_read: boolean
          copied_to_wa: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          related_task_id?: string | null
          is_read?: boolean
          copied_to_wa?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          related_task_id?: string | null
          is_read?: boolean
          copied_to_wa?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      content_cards: {
        Row: {
          id: string
          outlet_id: string
          title: string
          description: string | null
          status: string
          type: string
          target_platform: string
          scheduled_date: string | null
          published_date: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          outlet_id: string
          title: string
          description?: string | null
          status?: string
          type: string
          target_platform?: string
          scheduled_date?: string | null
          published_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          outlet_id?: string
          title?: string
          description?: string | null
          status?: string
          type?: string
          target_platform?: string
          scheduled_date?: string | null
          published_date?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'content_cards_outlet_id_fkey'
            columns: ['outlet_id']
            isOneToOne: false
            referencedRelation: 'outlets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'content_cards_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      content_ideas: {
        Row: {
          id: string
          outlet_id: string
          title: string
          description: string | null
          status: string
          votes: number
          suggested_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          outlet_id: string
          title: string
          description?: string | null
          status?: string
          votes?: number
          suggested_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          outlet_id?: string
          title?: string
          description?: string | null
          status?: string
          votes?: number
          suggested_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'content_ideas_outlet_id_fkey'
            columns: ['outlet_id']
            isOneToOne: false
            referencedRelation: 'outlets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'content_ideas_suggested_by_fkey'
            columns: ['suggested_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      idea_votes: {
        Row: {
          id: string
          idea_id: string
          user_id: string
          voted_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          user_id: string
          voted_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          user_id?: string
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'idea_votes_idea_id_fkey'
            columns: ['idea_id']
            isOneToOne: false
            referencedRelation: 'content_ideas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'idea_votes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      user_xp: {
        Row: {
          id: string
          user_id: string
          total_xp: number
          current_level: number
          xp_in_current_level: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_xp?: number
          current_level?: number
          xp_in_current_level?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_xp?: number
          current_level?: number
          xp_in_current_level?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
