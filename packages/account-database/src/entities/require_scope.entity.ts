import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OauthScopeEntity } from "./scope.entity";
import { OauthApplicationEntity } from "./application.entity";

@Entity("oauth-require-scope")
export class OauthRequireScopeEntity {
  @PrimaryColumn()
  scope_id!: number;

  @PrimaryColumn()
  application_id!: number;

  @Column({ default: false })
  is_essential?: boolean;

  @ManyToOne(() => OauthScopeEntity, (scope) => scope.requires, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "scope_id" })
  scope!: OauthScopeEntity;

  @ManyToOne(
    () => OauthApplicationEntity,
    (application) => application.requires,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "application_id" })
  application!: OauthApplicationEntity;
}
