import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { OauthRequireScopeEntity } from "./require_scope.entity";
import { OauthAgreedScopeEntity } from "./agreed_scopes.entity";

@Entity("oauth-scope")
export class OauthScopeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  value!: keyof UserEntity;

  @OneToMany(() => OauthRequireScopeEntity, (require) => require.scope)
  requires!: OauthRequireScopeEntity[];

  @OneToMany(() => OauthAgreedScopeEntity, (agreed) => agreed.scope)
  agreed!: OauthAgreedScopeEntity[];
}
