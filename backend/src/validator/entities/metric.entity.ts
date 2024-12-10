import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'validator-metrics',
})
export class Metric extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  index: number;

  @Column
  data: string;
}
