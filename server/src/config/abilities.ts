import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { IUser } from '../models/user.model';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'User' | 'Job' | 'Candidate' | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export const defineAbilityFor = (user: IUser) => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  switch (user.role) {
    case 'super-admin':
      can('manage', 'all');
      break;
    case 'admin':
      can(['read', 'update', 'create'], 'User');
      cannot('delete', 'User');
      can(['create', 'read', 'update', 'delete'], 'Job');
      can(['create', 'read', 'update', 'delete'], 'Candidate');

      break;

    case 'user':
      can('read', 'User');
      can('read', 'Job');
      can('update', 'User', { _id: user._id } as any);
      cannot('delete', 'User');

      break;

    default:
      can('read', 'User');
      break;
  }

  return build({
    detectSubjectType: (item: any) => item?.type || item?.constructor?.name,
  });
};
