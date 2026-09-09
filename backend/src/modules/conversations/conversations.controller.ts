import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { StartSessionDto } from './dto/start-session.dto';
import { ConversationTurnDto } from './dto/conversation-turn.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Conversations')
@ApiBearerAuth()
@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Get('scenarios')
  @ApiOperation({ summary: 'Get list of active AI conversational roleplay scenarios' })
  @ApiResponse({ status: 200, description: 'List of scenarios' })
  async getScenarios() {
    return this.conversationsService.getScenarios();
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Start a new conversation session with AI persona' })
  @ApiResponse({ status: 201, description: 'Session initialized with opening turn' })
  async startSession(
    @CurrentUser('id') userId: string,
    @Body() dto: StartSessionDto,
  ) {
    return this.conversationsService.startSession(userId, dto);
  }

  @Post('sessions/:id/turn')
  @ApiOperation({ summary: 'Submit user spoken dialogue turn and receive AI response' })
  @ApiResponse({ status: 200, description: 'Turn processed and AI response generated' })
  async processTurn(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
    @Body() dto: ConversationTurnDto,
  ) {
    return this.conversationsService.processTurn(userId, sessionId, dto);
  }

  @Post('sessions/:id/conclude')
  @ApiOperation({ summary: 'Conclude conversation session and receive report card' })
  @ApiResponse({ status: 200, description: 'Final communication diagnostic' })
  async concludeSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.conversationsService.concludeSession(userId, sessionId);
  }
}

