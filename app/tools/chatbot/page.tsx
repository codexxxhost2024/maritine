import { MaritimeChatbot } from "@/components/maritime-chatbot/maritime-chatbot"

export default function ChatbotPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Maritime Communication Chatbot</h1>
        <MaritimeChatbot />
      </div>
    </main>
  )
}
