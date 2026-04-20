import AIAssistant from '@/components/dashboard/AIAssistant'
import type { Message } from '@/lib/supabase/types'

type Props = {
  documentId: string
  messages: Pick<Message, 'id' | 'role' | 'content'>[]
}

export default function ChatInterface({ documentId, messages }: Props) {
  return (
    <div className="h-[500px]">
      <AIAssistant messages={messages} documentId={documentId} />
    </div>
  )
}
