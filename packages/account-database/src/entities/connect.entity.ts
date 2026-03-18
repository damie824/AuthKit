import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import type { Relation } from "typeorm";
import { UserEntity } from "./user.entity.js";
import { OauthApplicationEntity } from "./application.entity.js";
import { OauthAgreedScopeEntity } from "./agreed_scopes.entity.js";

@Entity("oauth-connect")
@Unique(["application_id", "user_id"])
export class OauthConnectEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  application_id!: number;

  @Column()
  user_id!: number;

  @Column()
  connected_at!: Date;

  @ManyToOne(() => UserEntity, (user) => user.oauth_connects, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: Relation<UserEntity>;

  @ManyToOne(
    () => OauthApplicationEntity,
    (application) => application.connected,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "application_id" })
  application!: Relation<OauthApplicationEntity>;

  @OneToMany(() => OauthAgreedScopeEntity, (agreed) => agreed.connect)
  agreed!: Relation<OauthAgreedScopeEntity[]>;
}
