import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OauthScopeEntity } from "./scope.entity";
import { OauthConnectEntity } from "./connect.entity";

@Entity("oauth-agreed-scope")
export class OauthAgreedScopeEntity {
  @PrimaryColumn()
  scope_id!: number;

  @PrimaryColumn()
  connect_id!: number;

  @Column()
  agreed_at!: Date;

  @ManyToOne(() => OauthScopeEntity, (scope) => scope.agreed, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "scope_id" })
  scope!: OauthScopeEntity;

  @ManyToOne(() => OauthConnectEntity, (connection) => connection.agreed, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "uesr_id" })
  user!: OauthConnectEntity;
}
