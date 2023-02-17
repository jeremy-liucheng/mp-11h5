export const enum MyElBtnType {
  default = 'default',
  success = 'success',
  warning = 'warning',
  info = 'info',
  text = 'text',
  primary = 'primary',
  danger = 'danger',
  '' = ''
}

export type btnDisplayType = keyof typeof MyElBtnType;

export const enum Role {
  /** 管理员 */
  Manager = 1,
  /** 运营 */
  Operator,
  /** 用户 */
  ProjectTeam,
  /** 测试人员 */
  Tester,
  /** 运营人员 */
  /** 其他 */
  Other,
  Bt
}

export const RoleMap = {
  [Role.Manager]: '管理员',
  [Role.ProjectTeam]: '用户'
};

export const enum FormatType {
  /** 保留一位小数 */
  one = '1',
  /** 保留二位小数 */
  two = '2',
  /** 百分比 */
  percent = '3',
  /** 需要枚举的 */
  enum = '4',
  /** 添加 ￥ */
  prefixRmb = '5'
}

export const SoftRecord: { [key: string]: any } = {
  certificate_path: 0,
  file_path: 1
};

export enum RouterType {
  CATALOG = 1,
  MENU,
  EXTLINK,
  TAB
}
