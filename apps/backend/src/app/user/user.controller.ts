import { Controller } from '@nestjs/common';
import { apiPathsEnum,  } from '@workspace/enums';
import { UserService } from './user.service';


@Controller(apiPathsEnum.user)
export class UserController {
  constructor(private userService: UserService) {
  }
}
