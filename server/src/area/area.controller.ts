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
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuardVerifiedEmail } from '../firebase/auth/auth.guard';
import { Request } from 'express';
import { AuthService } from '../firebase/auth/auth.service';
import { AreaDto } from './dto/area.dto';

@ApiTags('Area')
@Controller('areas')
export class AreaController {
  constructor(
    private readonly areaService: AreaService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create an area',
    description: 'Creates an area and returns its id',
  })
  async create(@Body() createAreaDto: CreateAreaDto, @Req() req: Request) {
    return this.areaService.create(
      createAreaDto,
      await this.authService.getUidFromRequest(req),
    );
  }

  @Get(':boardId')
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '<areas>',
    type: AreaDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all areas belonging to a board',
    description: 'Returns all areas belonging to a board',
  })
  async findAll(@Param('boardId') boardId: string, @Req() req: Request) {
    return this.areaService.findAll(
      boardId,
      await this.authService.getUidFromRequest(req),
    );
  }

  @Patch('area/:id')
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an area',
    description: 'Updates an area',
  })
  async update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areaService.update(id, updateAreaDto);
  }

  @Delete('area/:id')
  @UseGuards(AuthGuardVerifiedEmail)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete an area',
    description: 'Deletes an area',
  })
  async remove(@Param('id') id: string) {
    return this.areaService.remove(id);
  }
}
