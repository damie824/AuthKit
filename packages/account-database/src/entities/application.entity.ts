import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OauthRequireScopeEntity } from "./require_scope.entity";
import { OauthConnectEntity } from "./connect.entity";
import { OauthRedirectURIEntity } from "./redirect_uri.entity";

@Entity("oauth-application")
export class OauthApplicationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  secret!: string;

  @Column({ default: false })
  is_admin?: boolean;

  @OneToMany(() => OauthRequireScopeEntity, (require) => require.application)
  requires!: OauthRequireScopeEntity[];

  @OneToMany(() => OauthConnectEntity, (connect) => connect.application)
  connected!: OauthConnectEntity[];

  @OneToMany(() => OauthRedirectURIEntity, (uri) => uri.application)
  uri!: OauthRedirectURIEntity[];
}
