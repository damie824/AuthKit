import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { OauthRequireScopeEntity } from "./require_scope.entity.js";
import { OauthAgreedScopeEntity } from "./agreed_scopes.entity.js";

@Entity("oauth-scope")
export class OauthScopeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  value!: string;

  @OneToMany(() => OauthRequireScopeEntity, (require) => require.scope)
  requires!: Relation<OauthRequireScopeEntity[]>;

  @OneToMany(() => OauthAgreedScopeEntity, (agreed) => agreed.scope)
  agreed!: Relation<OauthAgreedScopeEntity[]>;
}
