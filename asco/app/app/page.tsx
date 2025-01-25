"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Maximize2, Plus, Paperclip } from "lucide-react"
import Navigation from "@/components/Navigation"
import { useRouter } from "next/navigation"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface Chat {
  id: number
  messages: { role: string; content: string }[]
}

interface Analysis {
  codeChanges: { description: string; rating: number }
  gasFeeReduction: { description: string; rating: number }
  securityImprovements: { description: string; rating: number }
}

export default function AppPage() {
  const [inputCode, setInputCode] = useState("")
  const [chats, setChats] = useState<Chat[]>([{ id: 1, messages: [] }])
  const [currentChatId, setCurrentChatId] = useState(1)
  const [userMessage, setUserMessage] = useState("")
  const [optimizedCode, setOptimizedCode] = useState("")
  const [showComparison, setShowComparison] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [editorWidth, setEditorWidth] = useState("100%")
  const [chatWidth, setChatWidth] = useState("0%")
  const editorRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const currentChat = chats.find((chat) => chat.id === currentChatId) || chats[0]

  const handleOptimize = async () => {
    addMessage("user", "Please optimize my smart contract.")
    setTimeout(() => {
      setOptimizedCode(`
// Optimized smart contract
contract OptimizedContract {
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        unchecked {
            _balances[msg.sender] -= amount;
            _balances[recipient] += amount;
        }
        return true;
    }
}
      `)
      setAnalysis({
        codeChanges: {
          description:
            "The contract has been optimized for gas efficiency. Key changes include using 'unchecked' blocks for arithmetic operations where overflow is not possible, and removing redundant checks.",
          rating: 4,
        },
        gasFeeReduction: {
          description:
            "Estimated gas fee reduction of 25% due to optimized storage access patterns and simplified transfer function.",
          rating: 5,
        },
        securityImprovements: {
          description:
            "Added input validation to prevent unauthorized transfers. Implemented checks for integer underflow in the transfer function.",
          rating: 3,
        },
      })
      addMessage("assistant", "I've optimized your smart contract. You can view the changes in the comparison view.")
      setShowComparison(true)
    }, 1000)
  }

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      addMessage("user", userMessage)
      setUserMessage("")
      // Simulating AI response
      setTimeout(() => {
        addMessage("assistant", "I'm analyzing your message. How can I assist you further with your smart contract?")
      }, 1000)
    }
  }

  const addMessage = (role: string, content: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, { role, content }] } : chat,
      ),
    )
  }

  const handleNewChat = () => {
    const newChatId = chats.length + 1
    setChats([...chats, { id: newChatId, messages: [] }])
    setCurrentChatId(newChatId)
    setInputCode("")
    setOptimizedCode("")
    setShowComparison(false)
    setAnalysis(null)
  }

  const handleChatSelect = (chatId: number) => {
    setCurrentChatId(chatId)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInputCode(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (showComparison) {
        setEditorWidth("50%")
        setChatWidth("50%")
      } else {
        setEditorWidth("100%")
        setChatWidth("0%")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [showComparison])

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-shrink-0 ${
            showSidebar ? "w-64" : "w-0"
          } transition-all duration-300 bg-muted overflow-y-auto`}
        >
          <div className="p-4">
            <Button onClick={handleNewChat} className="w-full mb-4">
              <Plus className="mr-2 h-4 w-4" /> New Chat
            </Button>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  chat.id === currentChatId ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
                onClick={() => handleChatSelect(chat.id)}
              >
                Chat {chat.id}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div style={{ width: editorWidth }} className="flex flex-col transition-all duration-300">
            <div className="flex-1 p-4 overflow-hidden">
              <MonacoEditor
                height="100%"
                language="move"
                theme="vs-dark"
                value={inputCode}
                onChange={(value) => setInputCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
            <div className="p-4 border-t flex justify-between items-center">
              <Button onClick={handleOptimize}>Optimize Contract</Button>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".js,.ts,.sol,.move"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="ml-2">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach File
                </Button>
              </div>
            </div>
          </div>
          {showComparison && (
            <div style={{ width: chatWidth }} className="flex flex-col border-l transition-all duration-300">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Optimized Contract</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowComparison(false)}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <MonacoEditor
                  height="50%"
                  language="javascript"
                  theme="vs-dark"
                  value={optimizedCode}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
                {analysis && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Analysis</h3>
                    <div className="space-y-4">
                      <AnalysisSection
                        title="Optimized Code Changes"
                        description={analysis.codeChanges.description}
                        rating={analysis.codeChanges.rating}
                      />
                      <AnalysisSection
                        title="Gas Fee Reduction"
                        description={analysis.gasFeeReduction.description}
                        rating={analysis.gasFeeReduction.rating}
                      />
                      <AnalysisSection
                        title="Security Improvements"
                        description={analysis.securityImprovements.description}
                        rating={analysis.securityImprovements.rating}
                      />
                    </div>
                  </div>
                )}
              </div>
             {/*<div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>*/}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AnalysisSection({ title, description, rating }: { title: string; description: string; rating: number }) {
  return (
    <div className="bg-card p-4 rounded-xl">
      <h4 className="text-md font-semibold mb-2">{title}</h4>
      <p className="text-muted-foreground mb-2">{description}</p>
      <div className="text-primary">{renderRating(rating)}</div>
    </div>
  )
}

function renderRating(rating: number) {
  return "⭐".repeat(rating) + "☆".repeat(5 - rating)
}

