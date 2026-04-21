import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST() {
  // Auth check via session cookie
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const userId = user.id
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const log = (step: number, msg: string) =>
    console.log(`[DELETE_ACCOUNT] User ${userId} - Step ${step} - ${msg}`)

  const errors: string[] = []

  // Étape 1 : Lister les fichiers Storage
  log(1, 'Listing storage files')
  let storageFiles: string[] = []
  try {
    const { data: files } = await admin.storage.from('documents').list(userId)
    storageFiles = (files ?? []).map(f => `${userId}/${f.name}`)
    log(1, `Found ${storageFiles.length} files`)
  } catch (e) {
    log(1, `Error listing files: ${e}`)
    errors.push('listing storage')
  }

  // Étape 2 : Supprimer les fichiers Storage
  if (storageFiles.length > 0) {
    log(2, `Deleting ${storageFiles.length} storage files`)
    try {
      const { error } = await admin.storage.from('documents').remove(storageFiles)
      if (error) throw error
      log(2, 'Storage files deleted')
    } catch (e) {
      log(2, `Error deleting storage: ${e}`)
      errors.push('deleting storage files')
    }
  } else {
    log(2, 'No storage files to delete')
  }

  // Étape 3 : Supprimer suggestions
  log(3, 'Deleting suggestions')
  try {
    const { error } = await admin.from('suggestions').delete().eq('user_id', userId)
    if (error) throw error
    log(3, 'Suggestions deleted')
  } catch (e) {
    log(3, `Error: ${e}`)
    errors.push('deleting suggestions')
  }

  // Étape 4 : Supprimer messages
  log(4, 'Deleting messages')
  try {
    const { error } = await admin.from('messages').delete().eq('user_id', userId)
    if (error) throw error
    log(4, 'Messages deleted')
  } catch (e) {
    log(4, `Error: ${e}`)
    errors.push('deleting messages')
  }

  // Étape 5 : Supprimer documents
  log(5, 'Deleting documents')
  try {
    const { error } = await admin.from('documents').delete().eq('user_id', userId)
    if (error) throw error
    log(5, 'Documents deleted')
  } catch (e) {
    log(5, `Error: ${e}`)
    errors.push('deleting documents')
  }

  // Étape 6 : Supprimer profil
  log(6, 'Deleting profile')
  try {
    const { error } = await admin.from('profiles').delete().eq('id', userId)
    if (error) throw error
    log(6, 'Profile deleted')
  } catch (e) {
    log(6, `Error: ${e}`)
    errors.push('deleting profile')
  }

  // Étape 7 : Supprimer compte auth
  log(7, 'Deleting auth user')
  try {
    const { error } = await admin.auth.admin.deleteUser(userId)
    if (error) throw error
    log(7, 'Auth user deleted')
  } catch (e) {
    log(7, `Error: ${e}`)
    errors.push('deleting auth user')
  }

  if (errors.length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 207 })
  }

  return NextResponse.json({ success: true })
}
