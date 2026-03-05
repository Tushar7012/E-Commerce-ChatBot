import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { PRODUCTS } from '../data/products.seed'
import { ORDERS } from '../data/orders.seed'

const genAI = new GoogleGenerativeAI(env.gemini.apiKey)

export interface ParsedResponse {
  cleanText: string
  messageType: 'text' | 'markdown' | 'product_card' | 'order_card' | 'quick_replies'
  metadata: Record<string, unknown>
}

interface ChatOptions {
  userMessage: string
  history: { role: 'user' | 'assistant'; content: string }[]
  knowledgeContext: string
  customerName?: string
  sessionMetadata?: Record<string, unknown>
}

function buildSystemPrompt(opts: Omit<ChatOptions, 'userMessage' | 'history'>): string {
  const productList = PRODUCTS.map(p => `- ${p.id}: ${p.name} ($${p.price}) [${p.category}]`).join('\n')
  const orderList = ORDERS.map(o => `- ${o.orderNumber}: status=${o.status}, total=$${o.total}`).join('\n')

  return `You are TechGear AI Support, a friendly and professional customer support assistant for TechGear — a premium consumer electronics retailer.

## YOUR PERSONA
- Warm, knowledgeable, and efficient
- Use the customer's name when known
- Keep responses concise (under 150 words unless technical detail is needed)
- Use minimal emojis (1-2 max per message)

## CUSTOMER CONTEXT
Customer name: ${opts.customerName ?? 'Guest'}

## RETRIEVED KNOWLEDGE BASE
Use this to answer questions accurately:
${opts.knowledgeContext}

## AVAILABLE PRODUCTS IN CATALOG
${productList}

## CUSTOMER'S RECENT ORDERS
${orderList}

## RESPONSE FORMAT INSTRUCTIONS
Respond in plain text or markdown. When you want to show structured data, append ONE action token at the very end of your message:

- To show a product: append [ACTION:SHOW_PRODUCT:prod_001]
- To show an order: append [ACTION:SHOW_ORDER:ORD-2024-8847]
- To suggest quick replies: append [ACTION:QUICK_REPLIES:["Option A","Option B","Option C"]]

Rules:
- Only ONE action token per response
- SHOW_PRODUCT: use the product ID from the catalog above
- SHOW_ORDER: use the exact order number
- QUICK_REPLIES: max 4 options, keep labels short (under 30 chars)
- After order/product display, offer relevant quick replies in the same message
- If a user asks about returns, warranty, shipping — use the KB context above
- If you cannot find an order number the user mentioned, say so politely and ask them to confirm
- Never fabricate product specs or order details not in the data above
- If the user seems frustrated (multiple failed attempts, angry language), acknowledge their frustration and offer to escalate to a human agent

## ESCALATION
If the user explicitly asks for a human agent, or if you cannot resolve their issue after 2 attempts, say:
"I'm connecting you with a human support agent now. Please wait a moment."
Then append: [ACTION:QUICK_REPLIES:["Yes, please escalate","No, keep helping me"]]`
}

/**
 * Parse action tokens from Gemini's raw output.
 * Extracts structured data and returns clean display text.
 */
export function parseResponse(raw: string): ParsedResponse {
  const actionRegex = /\[ACTION:(\w+):([^\]]+)\]$/m
  const match = raw.match(actionRegex)

  const cleanText = raw.replace(actionRegex, '').trim()

  if (!match) {
    return { cleanText, messageType: 'markdown', metadata: {} }
  }

  const [, actionType, payload] = match

  switch (actionType) {
    case 'SHOW_PRODUCT': {
      const productId = payload.trim()
      const product = PRODUCTS.find(p => p.id === productId)
      return {
        cleanText,
        messageType: 'product_card',
        metadata: { productId, product: product ?? null },
      }
    }

    case 'SHOW_ORDER': {
      const orderNumber = payload.trim()
      const order = ORDERS.find(o => o.orderNumber === orderNumber)
      return {
        cleanText,
        messageType: 'order_card',
        metadata: { orderNumber, order: order ?? null },
      }
    }

    case 'QUICK_REPLIES': {
      let options: string[] = []
      try {
        options = JSON.parse(payload)
      } catch {
        options = payload.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
      }
      return {
        cleanText,
        messageType: 'quick_replies',
        metadata: { options },
      }
    }

    default:
      return { cleanText, messageType: 'markdown', metadata: {} }
  }
}

/**
 * Send a message to Gemini and get a parsed response.
 */
export async function chat(opts: ChatOptions): Promise<ParsedResponse & { rawContent: string; tokensUsed: { input: number; output: number } }> {
  const systemPrompt = buildSystemPrompt({
    knowledgeContext: opts.knowledgeContext,
    customerName: opts.customerName,
    sessionMetadata: opts.sessionMetadata,
  })

  const model = genAI.getGenerativeModel({
    model: env.gemini.model,
    systemInstruction: systemPrompt,
  })

  // Keep last 16 messages (8 exchanges) to stay within context limits
  const trimmedHistory = opts.history.slice(-16)

  const chatSession = model.startChat({
    history: trimmedHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })),
  })

  const result = await chatSession.sendMessage(opts.userMessage)
  const rawContent = result.response.text()

  const usageMetadata = result.response.usageMetadata
  const parsed = parseResponse(rawContent)

  return {
    ...parsed,
    rawContent,
    tokensUsed: {
      input: usageMetadata?.promptTokenCount ?? 0,
      output: usageMetadata?.candidatesTokenCount ?? 0,
    },
  }
}
