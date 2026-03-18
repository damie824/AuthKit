import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import { OauthConnectEntity } from "./connect.entity.js";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @OneToMany(() => OauthConnectEntity, (connect) => connect.user)
  oauth_connects!: Relation<OauthConnectEntity[]>;
}
