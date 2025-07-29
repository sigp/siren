import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

import { ValidatorStatus } from '../../../../src/types/validator';

@Table({
  tableName: 'exclusions',
})
export class ExcludeStatus extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  status: ValidatorStatus;
}
