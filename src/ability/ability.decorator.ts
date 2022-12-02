import { SetMetadata } from "@nestjs/common";
import { IAbility } from "./ability.guard";

export const Rules = (...rules: IAbility[]) => SetMetadata("ability", rules);
