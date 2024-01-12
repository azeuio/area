import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { DatabaseService } from '../firebase/database/database.service';
import { Board } from './entities/board.entity';
import { BoardDto } from './dto/board.dto';
import { AreaService } from 'src/area/area.service';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class BoardsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly areaService: AreaService,
  ) {
    // prune boards that have no owner
    const pruneBoards = async () => {
      const boards = await this.db.getData<Board[]>(this.db.boardsRefId);
      if (!boards) {
        return;
      }
      for (const [id, board] of Object.entries(boards)) {
        if (!board.owner_id) {
          console.log(`Pruning board ${id} because it has no owner`);
          await this.remove(id);
        } else {
          const user = await this.db.getData<User>(
            `${this.db.usersRefId}/${board.owner_id}`,
          );
          if (!user) {
            console.log(
              `Pruning board ${id} because user ${board.owner_id} does not exist`,
            );
            await this.remove(id);
          }
        }
      }
    };
    setTimeout(pruneBoards, 0);
  }

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

  async findOne(id: string, uid?: string) {
    const board = await this.db.getData<Board>(`${this.db.boardsRefId}/${id}`);
    if (uid && board?.owner_id !== uid) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND, {
        cause: 'Board does not exist or does not belong to the user',
      });
    }
    return {
      id: id,
      ...board,
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

  async belongsToUser(id: string, uid: string) {
    const board = await this.db.getData<Board>(`${this.db.boardsRefId}/${id}`);
    if (!board) {
      return false;
    }
    if (board.owner_id !== uid) {
      return false;
    }
    return true;
  }

  async remove(id: string) {
    const areas = await this.areaService.findAll(id);
    for (const area of areas) {
      await this.areaService.remove(area.id);
    }
    await this.db.removeData(`${this.db.boardsRefId}/${id}`);
  }
}
