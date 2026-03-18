import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import { OauthRequireScopeEntity } from "./require_scope.entity.js";
import { OauthConnectEntity } from "./connect.entity.js";
import { OauthRedirectURIEntity } from "./redirect_uri.entity.js";

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
  requires!: Relation<OauthRequireScopeEntity[]>;

  @OneToMany(() => OauthConnectEntity, (connect) => connect.application)
  connected!: Relation<OauthConnectEntity[]>;

  @OneToMany(() => OauthRedirectURIEntity, (uri) => uri.application)
  uri!: Relation<OauthRedirectURIEntity[]>;
}
