// lib/supabase/types.ts
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          prenom: string | null
          email: string
          created_at: string
        }
        Insert: {
          id: string
          prenom?: string | null
          email: string
          created_at?: string
        }
        Update: {
          prenom?: string | null
          email?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          nom: string
          type_detecte: string | null
          resume: string | null
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nom: string
          type_detecte?: string | null
          resume?: string | null
          storage_path: string
          created_at?: string
        }
        Update: {
          nom?: string
          type_detecte?: string | null
          resume?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          user_id: string
          document_id: string | null
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_id?: string | null
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: never
      }
      suggestions: {
        Row: {
          id: string
          user_id: string
          contenu: SuggestionContenu
          statut: 'detectee' | 'en_attente_docs' | 'confirmee'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contenu: SuggestionContenu
          statut: 'detectee' | 'en_attente_docs' | 'confirmee'
          created_at?: string
        }
        Update: {
          statut?: 'detectee' | 'en_attente_docs' | 'confirmee'
        }
      }
    }
  }
}

export type AideProbabilite = 'confirmee' | 'probable' | 'possible' | 'faible'

export type Aide = {
  nom: string
  description: string
  lien?: string
  probabilite?: AideProbabilite
  montant_possible?: string
  document_requis?: string
}

export type SuggestionContenu =
  | { type: 'aides'; liste: Aide[] }
  | { type: 'manque_docs'; docs_requis: string[]; message: string }

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Suggestion = Database['public']['Tables']['suggestions']['Row']
