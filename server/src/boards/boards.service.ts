import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { DatabaseService } from '../firebase/database/database.service';
import { Board } from './entities/board.entity';
import { BoardDto } from './dto/board.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly db: DatabaseService) {}

  async create(createBoardDto: CreateBoardDto, uid: string) {
    const boardRef = await this.db.pushData(this.db.boardsRefId, {
      ...createBoardDto,
      owner_id: uid,
    });
    return boardRef.key;
  }

  async findAll(uid: string): Promise<BoardDto[]> {
    const boardsBelongingToUid = (
      await this.db
        .getRef(this.db.boardsRefId)
        .orderByChild('owner_id')
        .equalTo(uid)
        .once('value')
    ).val();
    if (!boardsBelongingToUid) {
      return [];
    }
    return Object.entries(boardsBelongingToUid).map(
      ([id, board]: [string, Board]) => ({
        id,
        ...board,
        owner_id: undefined,
      }),
    );
  }

  async findOne(id: string, uid: string) {
    const board = await this.db.getData<Board>(`${this.db.boardsRefId}/${id}`);
    if (board?.owner_id !== uid) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND, {
        cause: 'Board does not exist or does not belong to the user',
      });
    }
    return {
      id: id,
      ...board,
      owner_id: undefined,
    };
  }

  async update(id: string, updateBoardDto: UpdateBoardDto, uid: string) {
    const board = await this.db.getData<Board>(`${this.db.boardsRefId}/${id}`);
    if (board?.owner_id !== uid) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND, {
        cause: 'Board does not exist or does not belong to the user',
      });
    }
    await this.db.updateData(`${this.db.boardsRefId}/${id}`, updateBoardDto);
    return {
      id: id,
      ...updateBoardDto,
      owner_id: undefined,
    };
  }

  async remove(id: string, uid: string) {
    const board = await this.db.getData<Board>(`${this.db.boardsRefId}/${id}`);
    if (board?.owner_id !== uid) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND, {
        cause: 'Board does not exist or does not belong to the user',
      });
    }
    await this.db.removeData(`${this.db.boardsRefId}/${id}`);
  }
}
