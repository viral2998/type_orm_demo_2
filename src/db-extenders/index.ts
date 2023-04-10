import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn , DeleteDateColumn } from "typeorm";

@Entity()
export class DbEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  // Add this column to your entity!
  @DeleteDateColumn()
  deletedAt?: Date;
 
}

