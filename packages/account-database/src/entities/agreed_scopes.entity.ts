import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import type { Relation } from "typeorm";
import { OauthScopeEntity } from "./scope.entity.js";
import { OauthConnectEntity } from "./connect.entity.js";

@Entity("oauth-agreed-scope")
export class OauthAgreedScopeEntity {
  @PrimaryColumn()
  scope_id!: number;

  @PrimaryColumn({ type: "uuid" })
  connect_id!: string;

  @Column()
  agreed_at!: Date;

  @ManyToOne(() => OauthScopeEntity, (scope) => scope.agreed, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "scope_id" })
  scope!: Relation<OauthScopeEntity>;

  @ManyToOne(() => OauthConnectEntity, (connection) => connection.agreed, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "connect_id" })
  connect!: Relation<OauthConnectEntity>;
}
