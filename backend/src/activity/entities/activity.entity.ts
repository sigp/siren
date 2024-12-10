import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { ActivityType } from '../../../../src/types';

@Table({
  tableName: 'activities',
})
export class Activity extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  type: ActivityType;

  @Column
  pubKey: string;

  @Column
  data: string;

  @Column
  hasSeen: boolean;
}
