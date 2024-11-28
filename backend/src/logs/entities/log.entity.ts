import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
} from 'sequelize-typescript';
import { LogLevels, LogType } from '../../../../src/types';

@Table({
  tableName: 'logs',
})
export class Log extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  type: LogType;

  @Column
  level: LogLevels;

  @Unique('compositeIndex')
  @Column
  data: string;

  @Column
  isHidden: boolean;
}
