import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import * as sessionService from '../services/session.service'
import * as conversationService from '../services/conversation.service'
import * as ragService from '../services/rag.service'
import * as claudeService from '../services/claude.service'
import { supabase } from '../config/supabase'

const sendMessageSchema = z.object({
  sessionId: z.string().uuid('sessionId must be a UUID'),
  message: z.string().min(1).max(2000),
  customerName: z.string().max(100).optional(),
  customerEmail: z.string().email().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = sendMessageSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: body.error.issues[0].message },
      })
      return
    }

    const { sessionId, message, customerName, customerEmail, metadata } = body.data

    // 1. Get or create conversation
    const conversation = await sessionService.upsertConversation(
      sessionId,
      customerName,
      customerEmail,
      metadata
    )

    // 2. Load conversation history
    const history = await conversationService.getHistory(conversation.id, 20)

    // 3. Save user message immediately
    await conversationService.saveMessage({
      conversationId: conversation.id,
      role: 'user',
      content: message,
      messageType: 'text',
    })

    // 4. RAG: search knowledge base
    const articles = await ragService.searchKnowledge(message, 3)
    const knowledgeContext = ragService.formatContext(articles)

    // 5. Call Claude
    const response = await claudeService.chat({
      userMessage: message,
      history,
      knowledgeContext,
      customerName,
      sessionMetadata: metadata,
    })

    // 6. Save assistant message
    await conversationService.saveMessage({
      conversationId: conversation.id,
      role: 'assistant',
      content: response.cleanText,
      messageType: response.messageType,
      metadata: response.metadata,
    })

    // 7. Track analytics event
    await supabase.from('analytics_events').insert({
      conversation_id: conversation.id,
      event_type: 'message_sent',
      payload: {
        message_type: response.messageType,
        tokens_used: response.tokensUsed,
        kb_articles_retrieved: articles.length,
      },
    })

    res.json({
      success: true,
      data: {
        conversationId: conversation.id,
        message: response.cleanText,
        messageType: response.messageType,
        metadata: response.metadata,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { conversationId } = req.params
    const messages = await conversationService.getConversationMessages(conversationId)
    res.json({ success: true, data: messages })
  } catch (err) {
    next(err)
  }
}
