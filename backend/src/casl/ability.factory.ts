import { Page, Track, User } from '@prisma/client';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  ReadPrivateData = 'read-private-data',
  Edit = 'update',
}

type AppSubjects = { User: User; Track: Track; Page: Page };

export type AppAbility = PureAbility<
  [Action, Subjects<AppSubjects>],
  PrismaQuery
>;

export class AbilityFactory {
  createForUser(user: User | null) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user?.isAdmin) {
      builder.can(Action.Manage, 'User');
      builder.can(Action.Manage, 'Track');
      builder.can(Action.Manage, 'Page');
    } else {
      builder.can(Action.Read, 'Track', { private: false });

      if (user) {
        builder.can(Action.Read, 'Track', {
          private: true,
          userId: user.id,
        });

        builder.can(Action.ReadPrivateData, 'User', { id: user.id });

        builder.can(Action.ReadPrivateData, 'Page', { userId: user.id });

        builder.can(Action.ReadPrivateData, 'Track', {
          userId: user.id,
        });

        builder.can(Action.Edit, 'Track', { userId: user.id });

        builder.can(Action.Edit, 'Page', { userId: user.id });
      }
    }

    return builder.build();
  }
}
