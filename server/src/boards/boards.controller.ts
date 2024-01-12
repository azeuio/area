import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuardVerifiedEmail } from '../firebase/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../firebase/auth/auth.service';
import { BoardDto } from './dto/board.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a board',
    description: 'Creates a board and returns its id',
  })
  @ApiResponse({ status: 201, description: '<board_id>', type: String })
  async create(@Body() createBoardDto: CreateBoardDto, @Req() req: Request) {
    return await this.boardsService.create(
      createBoardDto,
      await this.authService.getUidFromRequest(req),
    );
  }

  @Get()
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all boards',
    description: 'Returns all boards belonging to the user',
  })
  async findAll(@Req() req: Request) {
    return await this.boardsService.findAll(
      await this.authService.getUidFromRequest(req),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a board',
    description:
      'Returns a board with the given id (only if it belongs to the user)',
  })
  @ApiResponse({ status: 200, type: BoardDto })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.boardsService.findOne(
      id,
      await this.authService.getUidFromRequest(req),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a board',
    description:
      'Updates a board with the given id (only if it belongs to the user)',
  })
  @ApiResponse({ status: 200, type: BoardDto })
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Req() req: Request,
  ) {
    return await this.boardsService.update(
      id,
      updateBoardDto,
      await this.authService.getUidFromRequest(req),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a board',
    description:
      'Deletes a board with the given id (only if it belongs to the user)',
  })
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiResponse({ status: 200, description: 'Board deleted' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const uid = await this.authService.getUidFromRequest(req);
    if (!(await this.boardsService.belongsToUser(id, uid))) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND, {
        cause: 'Board does not exist or does not belong to the user',
      });
    }
    await this.boardsService.remove(id);
    return 'Board deleted';
  }
}
