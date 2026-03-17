import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { OauthApplicationEntity } from "./application.entity";
import { OauthAgreedScopeEntity } from "./agreed_scopes.entity";

@Entity("oauth-connect")
export class OauthConnectEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @PrimaryColumn()
  application_id!: number;

  @PrimaryColumn()
  user_id!: number;

  @Column()
  connected_at!: Date;

  @ManyToOne(() => UserEntity, (user) => user.oauth_connects, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(
    () => OauthApplicationEntity,
    (application) => application.connected,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "application_id" })
  application!: OauthApplicationEntity;

  @OneToMany(() => OauthAgreedScopeEntity, (agreed) => agreed)
  agreed!: OauthAgreedScopeEntity[];
}
