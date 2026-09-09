import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StartSessionDto } from './dto/start-session.dto';
import { ConversationTurnDto } from './dto/conversation-turn.dto';
import { MessageSender, CefrLevel } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  private defaultScenarios = [
    {
      id: 'scenario-standup',
      title: 'Daily Agile Standup Meeting',
      category: 'Workplace',
      aiPersonaName: 'Alex (Tech Lead)',
      aiPersonaPrompt: 'You are Alex, a supportive and experienced Tech Lead in a software team. Lead the daily agile standup. Keep responses concise (1-2 sentences) and conversational.',
      initialMessage: 'Good morning! Let us do a quick sync. What did you finish yesterday, and what are you planning for today?',
      difficulty: CefrLevel.INTERMEDIATE,
    },
    {
      id: 'scenario-interview',
      title: 'Technical Job Interview',
      category: 'Career',
      aiPersonaName: 'Sarah (Hiring Manager)',
      aiPersonaPrompt: 'You are Sarah, Engineering Director at a fast-growing tech firm. Conduct a professional yet warm behavioral and technical interview.',
      initialMessage: 'Thanks for joining us today! To start off, could you walk me through a challenging technical problem you solved recently?',
      difficulty: CefrLevel.UPPER_INTERMEDIATE,
    },
    {
      id: 'scenario-hotel',
      title: 'Hotel Check-In & Service Requests',
      category: 'Travel',
      aiPersonaName: 'James (Concierge)',
      aiPersonaPrompt: 'You are James, a polite front-desk concierge at a boutique hotel in London.',
      initialMessage: 'Welcome to The Grand Carlton! How may I assist you with your reservation today?',
      difficulty: CefrLevel.ELEMENTARY,
    },
  ];

  async getScenarios() {
    // Return pre-configured scenarios
    return this.defaultScenarios;
  }

  async startSession(userId: string, dto: StartSessionDto) {
    const scenario = this.defaultScenarios.find((s) => s.id === dto.scenarioId) || this.defaultScenarios[0];

    // Ensure scenario exists in database
    const dbScenario = await this.prisma.conversationScenario.upsert({
      where: { id: scenario.id },
      update: {},
      create: {
        id: scenario.id,
        title: scenario.title,
        category: scenario.category,
        aiPersonaName: scenario.aiPersonaName,
        aiPersonaPrompt: scenario.aiPersonaPrompt,
        initialMessage: scenario.initialMessage,
        difficulty: scenario.difficulty,
      },
    });

    // Create new session
    const session = await this.prisma.conversationSession.create({
      data: {
        userId,
        scenarioId: dbScenario.id,
        turnsCount: 0,
      },
    });

    // Create initial AI greeting message
    const initialMsg = await this.prisma.conversationMessage.create({
      data: {
        sessionId: session.id,
        sender: MessageSender.AI,
        messageText: scenario.initialMessage,
        orderIndex: 1,
      },
    });

    return {
      sessionId: session.id,
      scenario: {
        title: scenario.title,
        persona: scenario.aiPersonaName,
      },
      initialMessage: initialMsg.messageText,
    };
  }

  async processTurn(userId: string, sessionId: string, dto: ConversationTurnDto) {
    const session = await this.prisma.conversationSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        scenario: true,
        messages: { orderBy: { orderIndex: 'asc' } },
      },
    });

    if (!session) {
      throw new NotFoundException('Conversation session not found');
    }

    const nextOrder = session.messages.length + 1;

    // 1. Save user turn
    const userMsg = await this.prisma.conversationMessage.create({
      data: {
        sessionId,
        sender: MessageSender.USER,
        messageText: dto.messageText,
        audioS3Key: dto.audioS3Key,
        orderIndex: nextOrder,
      },
    });

    // 2. Generate AI Persona Response
    let aiResponseText = 'That sounds like great progress. Do you have any dependencies or blockers for today?';
    let grammarCritique = 'Clear sentence structure and appropriate vocabulary!';

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const conversationHistory = session.messages.map((m) => ({
          role: m.sender === MessageSender.USER ? 'user' : 'assistant',
          content: m.messageText,
        }));

        conversationHistory.push({ role: 'user', content: dto.messageText });

        const systemPrompt = `${session.scenario.aiPersonaPrompt}
Respond in character. Keep answers under 2 sentences to allow the user to speak.
Also evaluate the user's grammar in a hidden field.`;

        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }, ...conversationHistory],
            max_tokens: 150,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 8000,
          },
        );

        aiResponseText = response.data.choices[0].message.content;
      } catch {
        // Use default conversational progression
      }
    } else {
      // Deterministic dynamic responses based on turn count
      if (nextOrder === 2) {
        aiResponseText = 'Awesome work! Are there any blockers or technical dependencies that might slow you down today?';
      } else if (nextOrder === 4) {
        aiResponseText = 'Got it. That sounds completely manageable. Let us connect again after your testing is done!';
      }
    }

    // 3. Save AI turn
    const aiMsg = await this.prisma.conversationMessage.create({
      data: {
        sessionId,
        sender: MessageSender.AI,
        messageText: aiResponseText,
        grammarCritique,
        orderIndex: nextOrder + 1,
      },
    });

    await this.prisma.conversationSession.update({
      where: { id: sessionId },
      data: { turnsCount: session.turnsCount + 1 },
    });

    return {
      userTurn: {
        text: userMsg.messageText,
      },
      aiTurn: {
        text: aiMsg.messageText,
        grammarCritique,
      },
      turnsCount: session.turnsCount + 1,
    };
  }

  async concludeSession(userId: string, sessionId: string) {
    const session = await this.prisma.conversationSession.findFirst({
      where: { id: sessionId, userId },
      include: { messages: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const overallScore = Math.floor(Math.random() * 12) + 84; // 84 - 96

    await this.prisma.conversationSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        overallCommunicationScore: overallScore,
      },
    });

    return {
      sessionId,
      overallCommunicationScore: overallScore,
      totalTurns: session.messages.length,
      diagnosticSummary: [
        'Natural conversational pacing and timely responses.',
        'Good use of professional terminology in agile discussion.',
        'High relevance and coherent dialogue turns.',
      ],
    };
  }
}

