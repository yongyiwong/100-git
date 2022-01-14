export enum TencentStreamStateEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FORBIDDEN = 'forbid',
}

export function getTencentStreamState(state: string) {
  let tencentStreamState = null;

  switch (state) {
    case 'active':
      tencentStreamState = TencentStreamStateEnum.ACTIVE;
      break;
    case 'inactive':
      tencentStreamState = TencentStreamStateEnum.INACTIVE;
      break;
    case 'forbid':
      tencentStreamState = TencentStreamStateEnum.FORBIDDEN;
      break;
  }

  return tencentStreamState;
}
