import {
  Column,
  AfterLoad,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import { EntityHelper } from '@/utils/entity-helper';
import { hashPassword } from '@/utils/heplers';

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

@Entity('users')
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      this.password = await hashPassword(this.password);
    }
  }

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Inactive })
  status: UserStatus;

  @Index()
  @Column({ type: String, nullable: true })
  socialId: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: String, nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
