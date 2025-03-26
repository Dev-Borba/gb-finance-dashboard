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
      users: {
        Row: {
          id: string
          name: string
          email: string
          password: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          password: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password?: string
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          description: string
          amount: number
          type: 'income' | 'expense'
          category: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          amount: number
          type: 'income' | 'expense'
          category: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          amount?: number
          type?: 'income' | 'expense'
          category?: string
          date?: string
          created_at?: string
        }
      }
    }
  }
}