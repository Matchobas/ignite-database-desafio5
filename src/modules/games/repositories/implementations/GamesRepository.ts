import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games')
      .select('games.title', 'title')
      .where(`games.title ILIKE :title`, { title: `%${param}%` })
      .getRawMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT count(id) FROM games');
  }

  // SELECT * FROM users_games_games AS ugg INNER JOIN user ON user.id = ugg.usersId WHERE ugg.gamesId = id  
  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder('games')
      .where('games.id = :id', { id })
      .relation(Game, 'users')
      .of(id)
      .loadMany()
  }
}
