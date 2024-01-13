import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { DatabaseService } from '../firebase/database/database.service';
import { Board } from 'src/boards/entities/board.entity';
import { Area } from './entities/area.entity';

@Injectable()
export class AreaService {
  constructor(private readonly db: DatabaseService) {}

  async create(createAreaDto: CreateAreaDto, uid: string) {
    try {
      const board = await this.db.getData<Board>(
        `${this.db.boardsRefId}/${createAreaDto.board_id}`,
      );
      if (board?.owner_id !== uid) {
        throw new HttpException('Board not found', HttpStatus.NOT_FOUND, {
          cause: 'Board does not exist or does not belong to the user',
        });
      }
    } catch (e) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND, {
        cause: 'Board does not exist or does not belong to the user',
      });
    }
    const ref = await this.db.pushData<Area>(this.db.areasRefId, {
      action: createAreaDto.action,
      board_id: createAreaDto.board_id,
    });
    if (createAreaDto.child_id) {
      await this.db.updateData<Area>(`${this.db.areasRefId}/${ref.key}`, {
        child_id: createAreaDto.child_id,
      });
    }
    if (createAreaDto.parent_id) {
      await this.db.updateData<Area>(
        `${this.db.areasRefId}/${createAreaDto.parent_id}`,
        {
          child_id: ref.key,
        },
      );
    }
    return ref.key;
  }

  async belongsToUser(id: string, uid: string) {
    const area = await this.db.getData<Area>(`${this.db.areasRefId}/${id}`);
    if (!area) {
      return false;
    }
    return await this.boardBelongsToUser(area.board_id, uid);
  }

  async boardBelongsToUser(boardId: string, uid: string) {
    const board = await this.db.getData<Board>(
      `${this.db.boardsRefId}/${boardId}`,
    );
    if (!board) {
      return false;
    }
    if (board.owner_id !== uid) {
      return false;
    }
    return true;
  }

  async findAll(boardId: string): Promise<(Area & { id: string })[]> {
    try {
      const board = await this.db.getData<Board>(
        `${this.db.boardsRefId}/${boardId}`,
      );
      if (board === null) {
        throw new HttpException('Board not found', HttpStatus.NOT_FOUND, {
          cause: 'Board does not exist or does not belong to the user',
        });
      }
    } catch (e) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND, {
        cause: 'Board does not exist or does not belong to the user',
      });
    }

    const areas = await this.db
      .getRef(this.db.areasRefId)
      .orderByChild('board_id')
      .equalTo(boardId)
      .once('value');
    return areas.val();
  }

  async findOne(id: string) {
    const area = await this.db.getData<Area>(`${this.db.areasRefId}/${id}`);
    if (!area) {
      throw new HttpException('Area not found', HttpStatus.NOT_FOUND);
    }
    return area;
  }

  async update(id: string, updateAreaDto: UpdateAreaDto) {
    return await this.db.updateData(
      `${this.db.areasRefId}/${id}`,
      updateAreaDto,
    );
  }

  remove(id: string) {
    return this.db.removeData(`${this.db.areasRefId}/${id}`);
  }
}
