import { IPolicyHandler } from '../policies-handler.interface';
import { Action, AppAbility } from '../ability.factory';
import { subject } from '@casl/ability';
import { Page } from '@prisma/client';

export class EditPageHandler implements IPolicyHandler {
  constructor(private page: Page) {}

  handle(ability: AppAbility) {
    return ability.can(Action.Edit, subject('Page', this.page));
  }
}
